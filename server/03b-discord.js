const discordBot = (function() {
  try {
    const text = fs.readFileSync(require('path').join(__dirname, '.env')).toString()
    for(const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
      if(match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
      }
    }
  } catch(e) {}

  const defaults = {
    guild: '1522765325156876368',
    channels: {
      gameLogs: '1571968350240772266',
      gameStatus: '1571968259031310446',
      profanity: '1571967895049605181',
      spam: '1571967960912765059',
      chatLogs: '1571966169550950580',
      welcome: '1522765954486894663',
      commandLogs: '1571967677788848158'
    },
    statusSeconds: 60,
    spamMessages: 6,
    spamSeconds: 5,
    mentionLimit: 5,
    spamTimeoutMinutes: 5
  }
  const custom = config.discord || {}
  const settings = { ...defaults, ...custom, channels: { ...defaults.channels, ...(custom.channels || {}) } }
  const token = process.env.DISCORD_TOKEN
  const STATUS_TITLE = 'Server status'
  const startedAt = Date.now()

  let Discord = null
  if(token) {
    try {
      Discord = require('discord.js')
    } catch(e) {
      console.log('discord: discord.js is missing, run npm install')
    }
  } else {
    console.log('discord: no DISCORD_TOKEN in .env, bot disabled')
  }

  const clean = function(text, max) {
    let s = String(text == null ? '' : text).replace(/\s+/g, ' ').trim().slice(0, max || 100)
    return Discord ? Discord.escapeMarkdown(s) : s
  }

  const code = function(text, max) {
    let s = String(text == null ? '' : text).replace(/`/g, '\'').replace(/\s+/g, ' ').trim().slice(0, max || 300)
    return s ? '`' + s + '`' : '`(empty)`'
  }

  const player = function(c, name) {
    let shown = name || (c && c.data && c.data.name) || ''
    let s = shown ? `**${clean(shown, 50)}**` : '**unnamed**'
    if(c && c.accountName) { s += ` (account ${clean(c.accountName, 50)})` }
    return s
  }

  const ip = function(c) {
    return c && c._ip ? ' ' + code(c._ip) : ''
  }

  const duration = function(seconds) {
    seconds = Math.max(0, Math.round(seconds))
    if(seconds < 60) { return `${seconds}s` }
    if(seconds < 3600) { return `${Math.floor(seconds / 60)}m${seconds % 60}s` }
    return `${Math.floor(seconds / 3600)}h${Math.floor(seconds / 60) % 60}m`
  }

  const dimLabel = function(name) {
    for(const type in workers) {
      const d = workers[type].dims && workers[type].dims[name]
      if(d) { return d[1][1] || name }
    }
    return name
  }

  const queues = {}
  const send = function(channel, text) {
    if(!Discord || !settings.channels[channel]) { return }
    const q = queues[channel] || (queues[channel] = { lines: [], skipped: 0 })
    if(q.lines.length >= 300) {
      q.skipped ++
      return
    }
    q.lines.push(String(text).slice(0, 1900))
  }

  let client = null, ready = false, stopping = false, statusMessage = null
  const channelCache = {}

  const getChannel = async function(key) {
    if(channelCache[key] !== undefined) { return channelCache[key] }
    let channel = null
    try {
      channel = await client.channels.fetch(settings.channels[key])
    } catch(e) {}
    if(!channel || !channel.isTextBased()) {
      console.log(`discord: can't use the ${key} channel (${settings.channels[key]}), check the ID and the bot's access`)
      channel = null
    }
    channelCache[key] = channel
    return channel
  }

  const flush = async function() {
    if(!ready) { return }
    const sends = []
    for(const key in queues) {
      const q = queues[key]
      if(!q.lines.length && !q.skipped) { continue }
      const channel = await getChannel(key)
      if(!channel) {
        q.lines = []
        q.skipped = 0
        continue
      }
      let text = ''
      while(q.lines.length && text.length + q.lines[0].length + 1 <= 1900) {
        text += (text ? '\n' : '') + q.lines.shift()
      }
      if(!text && q.lines.length) { text = q.lines.shift() }
      if(q.skipped && !q.lines.length) {
        text += `\n*${q.skipped} more lines were skipped because too many came in at once.*`
        q.skipped = 0
      }
      sends.push(channel.send({ content: text, allowedMentions: { parse: [] } }).catch(function(e) {
        console.log(`discord: sending to ${key} failed:`, e.message)
      }))
    }
    await Promise.all(sends)
  }

  const statusEmbed = function(offline) {
    const embed = new Discord.EmbedBuilder().setTitle(STATUS_TITLE).setTimestamp()
    if(offline) {
      return embed.setColor(0xd73a49).setDescription('The server is offline.').setFooter({ text: 'Offline' })
    }
    const counts = stats()
    const lines = []
    let total = 0
    for(const type in workers) {
      for(const name in workers[type].dims) {
        const d = workers[type].dims[name]
        const n = counts[name] ? counts[name][0] || 0 : 0
        total += n
        lines.push(`${clean(d[1][1] || name, 50)}: **${n}**`)
      }
    }
    return embed
      .setColor(locked ? 0xe3a008 : 0x2ea043)
      .setDescription(lines.join('\n') || 'No dimensions are running.')
      .addFields(
        { name: 'Players online', value: String(total), inline: true },
        { name: 'Up since', value: `<t:${Math.floor(startedAt / 1000)}:R>`, inline: true },
        { name: 'Memory', value: `${Math.round(process.memoryUsage().rss / 1048576)} MB`, inline: true }
      )
      .setFooter({ text: locked ? 'Closing' : 'Online' })
  }

  const updateStatus = async function(offline) {
    if(!ready) { return }
    const channel = await getChannel('gameStatus')
    if(!channel) { return }
    try {
      if(!statusMessage) {
        const recent = await channel.messages.fetch({ limit: 25 })
        statusMessage = recent.find(function(m) {
          return m.author.id === client.user.id && m.embeds[0] && m.embeds[0].title === STATUS_TITLE
        }) || null
      }
      const payload = { embeds: [statusEmbed(offline)] }
      if(statusMessage) {
        await statusMessage.edit(payload)
      } else {
        statusMessage = await channel.send(payload)
      }
    } catch(e) {
      statusMessage = null
      console.log('discord: status update failed:', e.message)
    }
  }

  const fromWorker = function(m) {
    const [channel, label, value, uid, dimName, name] = m
    if(['profanity', 'spam', 'commandLogs', 'gameLogs'].indexOf(channel) < 0) { return }
    const c = uids[uid]
    let line = `${player(c, name)}${channel === 'spam' ? ip(c) : ''} ${label}`
    if(dimName) { line += ` in *${clean(dimLabel(dimName), 50)}*` }
    if(value) { line += channel === 'profanity' ? `: ||${clean(value, 300)}||` : `: ${code(value)}` }
    send(channel, line)
  }

  const shutdown = function(reason) {
    if(stopping) { return }
    stopping = true
    if(!ready) { return process.exit(0) }
    send('gameStatus', `Server stopping (${reason})`)
    const done = Promise.all([flush(), updateStatus(true)])
    Promise.race([done, new Promise(function(r) { setTimeout(r, 4000) })]).finally(function() {
      process.exit(0)
    })
  }

  const api = { send, clean, code, player, ip, duration, dimLabel, fromWorker, shutdown }
  if(!Discord) { return api }

  const { Client, GatewayIntentBits, Partials, Events, SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType } = Discord

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
    allowedMentions: { parse: [] }
  })

  const inGuild = function(guild) {
    return guild && guild.id === settings.guild
  }

  const userLabel = function(user) {
    return user ? `<@${user.id}> (${clean(user.username, 40)})` : 'someone'
  }

  const gameClients = function() {
    return clients.filter(function(c) { return c.fsocket && c.fsocket.dim })
  }

  const findPlayer = function(query) {
    const q = String(query).toLowerCase()
    const list = gameClients()
    const exact = list.filter(function(c) {
      return (c.data.name || '').toLowerCase() === q || (c.accountName || '').toLowerCase() === q
    })
    const found = exact.length ? exact : list.filter(function(c) { return (c.data.name || '').toLowerCase().includes(q) })
    if(found.length === 1) { return { client: found[0] } }
    if(!found.length) { return { error: `No player in game matches "${clean(query, 50)}".` } }
    return { error: `${found.length} players match, be more exact: ${found.slice(0, 10).map(function(c) { return player(c) }).join(', ')}` }
  }

  const dimChoices = function() {
    const list = []
    for(const type in workers) {
      for(const name in workers[type].dims) {
        list.push({ name: `${workers[type].dims[name][1][1] || name} (${name})`, value: name, type: type })
      }
    }
    return list
  }

  const actor = function(interaction) {
    return `Discord ${interaction.user.username}`
  }

  const outranks = function(interaction, member) {
    if(!member) { return 'That user is not in this server.' }
    if(member.id === interaction.user.id) { return 'You can\'t do that to yourself.' }
    if(member.id === interaction.guild.ownerId) { return 'You can\'t do that to the server owner.' }
    if(interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return 'That member has the same or a higher role than you.'
    }
    return ''
  }

  const auditReason = function(interaction) {
    return `${interaction.options.getString('reason') || 'No reason given'} (by ${interaction.user.username})`
  }

  const commands = [
    new SlashCommandBuilder().setName('status').setDescription('Show the game server status and player counts'),
    new SlashCommandBuilder().setName('players').setDescription('List the players in game')
      .addStringOption(o => o.setName('dimension').setDescription('Only this dimension').setAutocomplete(true)),
    new SlashCommandBuilder().setName('game').setDescription('Manage the game server')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand(s => s.setName('announce').setDescription('Send an announcement to every player')
        .addStringOption(o => o.setName('message').setDescription('The announcement').setRequired(true).setMaxLength(200)))
      .addSubcommand(s => s.setName('kick').setDescription('Kick a player from the game')
        .addStringOption(o => o.setName('player').setDescription('Player or account name').setRequired(true).setAutocomplete(true)))
      .addSubcommand(s => s.setName('ban').setDescription('Ban a player\'s IP from the game')
        .addStringOption(o => o.setName('player').setDescription('Player or account name').setRequired(true).setAutocomplete(true))
        .addStringOption(o => o.setName('reason').setDescription('Why')))
      .addSubcommand(s => s.setName('unban').setDescription('Remove a game ban')
        .addStringOption(o => o.setName('target').setDescription('IP or banned name').setRequired(true)))
      .addSubcommand(s => s.setName('role').setDescription('Show or set an account\'s staff role')
        .addStringOption(o => o.setName('account').setDescription('Account name').setRequired(true))
        .addStringOption(o => o.setName('role').setDescription('New role').addChoices(...staffRoles.map(r => ({ name: r, value: r })))))
      .addSubcommand(s => s.setName('restart').setDescription('Restart a dimension (players are moved out first)')
        .addStringOption(o => o.setName('dimension').setDescription('Dimension').setRequired(true).setAutocomplete(true))),
    new SlashCommandBuilder().setName('purge').setDescription('Delete recent messages in this channel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addIntegerOption(o => o.setName('amount').setDescription('How many (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
      .addUserOption(o => o.setName('user').setDescription('Only messages from this user')),
    new SlashCommandBuilder().setName('timeout').setDescription('Time out a member')
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('member').setDescription('Member').setRequired(true))
      .addIntegerOption(o => o.setName('minutes').setDescription('How long (max 28 days)').setRequired(true).setMinValue(1).setMaxValue(40320))
      .addStringOption(o => o.setName('reason').setDescription('Why')),
    new SlashCommandBuilder().setName('untimeout').setDescription('Remove a member\'s timeout')
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('member').setDescription('Member').setRequired(true)),
    new SlashCommandBuilder().setName('warn').setDescription('Warn a member by DM')
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('member').setDescription('Member').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Why').setRequired(true)),
    new SlashCommandBuilder().setName('kick').setDescription('Kick a member from the server')
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption(o => o.setName('member').setDescription('Member').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Why')),
    new SlashCommandBuilder().setName('ban').setDescription('Ban a user from the server')
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Why'))
      .addIntegerOption(o => o.setName('delete_hours').setDescription('Delete their messages from the last N hours (max 168)').setMinValue(0).setMaxValue(168)),
    new SlashCommandBuilder().setName('unban').setDescription('Unban a user from the server')
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addStringOption(o => o.setName('user_id').setDescription('User ID').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Why')),
    new SlashCommandBuilder().setName('slowmode').setDescription('Set a channel\'s slowmode')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addIntegerOption(o => o.setName('seconds').setDescription('0 turns it off (max 21600)').setRequired(true).setMinValue(0).setMaxValue(21600))
      .addChannelOption(o => o.setName('channel').setDescription('Channel (default: this one)').addChannelTypes(ChannelType.GuildText)),
    new SlashCommandBuilder().setName('lock').setDescription('Stop everyone from sending messages in a channel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption(o => o.setName('channel').setDescription('Channel (default: this one)').addChannelTypes(ChannelType.GuildText)),
    new SlashCommandBuilder().setName('unlock').setDescription('Let everyone send messages in a channel again')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption(o => o.setName('channel').setDescription('Channel (default: this one)').addChannelTypes(ChannelType.GuildText))
  ]

  const gameCommands = {
    announce: function(interaction) {
      const text = interaction.options.getString('message')
      for(const type in workers) { workers[type].worker.postMessage(['globalAnnounce', text]) }
      send('gameLogs', `${clean(interaction.user.username, 40)} announced from Discord: ${code(text)}`)
      return 'Announcement sent.'
    },
    kick: function(interaction) {
      const found = findPlayer(interaction.options.getString('player'))
      if(found.error) { return found.error }
      let note = ''
      staffAction('kick', [found.client.data.id, actor(interaction)], function(t) { note = t })
      return note || `Kicked ${player(found.client)}.`
    },
    ban: function(interaction) {
      const found = findPlayer(interaction.options.getString('player'))
      if(found.error) { return found.error }
      let note = ''
      const name = found.client.accountName || found.client.data.name
      staffAction('ban', [found.client.data.id, actor(interaction), name], function(t) { note = t })
      const reason = interaction.options.getString('reason')
      if(reason) { send('gameLogs', `Ban reason for ${clean(name, 50)}: ${code(reason)}`) }
      return note
    },
    unban: function(interaction) {
      let note = ''
      staffAction('unban', [interaction.options.getString('target'), actor(interaction)], function(t) { note = t })
      return note
    },
    role: function(interaction) {
      let note = ''
      staffAction('setRole', [interaction.options.getString('account'), interaction.options.getString('role'), actor(interaction)], function(t) { note = t })
      return note
    },
    restart: function(interaction) {
      const name = interaction.options.getString('dimension')
      const choice = dimChoices().find(function(d) { return d.value === name || d.type === name })
      if(!choice || !workers[choice.type]) { return `There is no dimension called "${clean(name, 50)}".` }
      workers[choice.type].restart(true)
      return `Restarting ${clean(choice.type, 50)}.`
    }
  }

  const handlers = {
    status: function() {
      return { embeds: [statusEmbed(false)], shown: true }
    },
    players: function(interaction) {
      const only = interaction.options.getString('dimension')
      const groups = {}
      for(const c of gameClients()) {
        const name = c.fsocket.dim[1][0]
        if(only && name !== only) { continue }
        const label = c.fsocket.dim[1][1] || name;
        (groups[label] = groups[label] || []).push(player(c))
      }
      const lines = Object.keys(groups).map(function(label) {
        return `**${clean(label, 50)}** (${groups[label].length}): ${groups[label].join(', ')}`
      })
      return { content: (lines.join('\n') || 'Nobody is playing right now.').slice(0, 1900), shown: true }
    },
    game: function(interaction) {
      return gameCommands[interaction.options.getSubcommand()](interaction)
    },
    purge: async function(interaction) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral })
      const amount = interaction.options.getInteger('amount')
      const user = interaction.options.getUser('user')
      const fetched = await interaction.channel.messages.fetch({ limit: 100 })
      const list = [...fetched.values()].filter(function(m) { return !user || m.author.id === user.id }).slice(0, amount)
      const deleted = await interaction.channel.bulkDelete(list, true)
      return `Deleted ${deleted.size} message${deleted.size === 1 ? '' : 's'}${deleted.size < list.length ? ' (messages older than 14 days can\'t be bulk deleted)' : ''}.`
    },
    timeout: async function(interaction) {
      const member = interaction.options.getMember('member')
      const problem = outranks(interaction, member)
      if(problem) { return problem }
      if(!member.moderatable) { return 'I can\'t time out that member, my role is too low.' }
      const minutes = interaction.options.getInteger('minutes')
      await member.timeout(minutes * 60000, auditReason(interaction))
      return `Timed out ${userLabel(member.user)} for ${duration(minutes * 60)}.`
    },
    untimeout: async function(interaction) {
      const member = interaction.options.getMember('member')
      if(!member) { return 'That user is not in this server.' }
      if(!member.moderatable) { return 'I can\'t change that member, my role is too low.' }
      await member.timeout(null, `Timeout removed by ${interaction.user.username}`)
      return `Removed the timeout from ${userLabel(member.user)}.`
    },
    warn: async function(interaction) {
      const member = interaction.options.getMember('member')
      const problem = outranks(interaction, member)
      if(problem) { return problem }
      const reason = interaction.options.getString('reason')
      const dm = await member.send(`You were warned in **${clean(interaction.guild.name, 100)}**: ${reason}`).then(() => true, () => false)
      return `Warned ${userLabel(member.user)}${dm ? '' : ' (their DMs are closed, so they were not told)'}.`
    },
    kick: async function(interaction) {
      const member = interaction.options.getMember('member')
      const problem = outranks(interaction, member)
      if(problem) { return problem }
      if(!member.kickable) { return 'I can\'t kick that member, my role is too low.' }
      await member.kick(auditReason(interaction))
      return `Kicked ${userLabel(member.user)}.`
    },
    ban: async function(interaction) {
      const user = interaction.options.getUser('user')
      const member = interaction.options.getMember('user')
      if(member) {
        const problem = outranks(interaction, member)
        if(problem) { return problem }
        if(!member.bannable) { return 'I can\'t ban that member, my role is too low.' }
      }
      const hours = interaction.options.getInteger('delete_hours') || 0
      await interaction.guild.members.ban(user, { reason: auditReason(interaction), deleteMessageSeconds: hours * 3600 })
      return `Banned ${userLabel(user)}.`
    },
    unban: async function(interaction) {
      const id = interaction.options.getString('user_id').replace(/\D/g, '')
      if(!id) { return 'That is not a user ID.' }
      await interaction.guild.members.unban(id, auditReason(interaction))
      return `Unbanned <@${id}>.`
    },
    slowmode: async function(interaction) {
      const channel = interaction.options.getChannel('channel') || interaction.channel
      const seconds = interaction.options.getInteger('seconds')
      await channel.setRateLimitPerUser(seconds, `By ${interaction.user.username}`)
      return seconds ? `Slowmode in <#${channel.id}> is now ${duration(seconds)}.` : `Slowmode in <#${channel.id}> is off.`
    },
    lock: async function(interaction) {
      const channel = interaction.options.getChannel('channel') || interaction.channel
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false }, { reason: `Locked by ${interaction.user.username}` })
      return `Locked <#${channel.id}>.`
    },
    unlock: async function(interaction) {
      const channel = interaction.options.getChannel('channel') || interaction.channel
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null }, { reason: `Unlocked by ${interaction.user.username}` })
      return `Unlocked <#${channel.id}>.`
    }
  }

  const describe = function(interaction) {
    const parts = ['/' + interaction.commandName]
    const walk = function(list) {
      for(const o of list || []) {
        if(o.type === 1 || o.type === 2) {
          parts.push(o.name)
          walk(o.options)
        } else if(o.user) {
          parts.push(`${o.name}:@${o.user.username}`)
        } else if(o.channel) {
          parts.push(`${o.name}:#${o.channel.name}`)
        } else {
          parts.push(`${o.name}:${o.value}`)
        }
      }
    }
    walk(interaction.options.data)
    return parts.join(' ')
  }

  const autocomplete = function(interaction) {
    const focused = interaction.options.getFocused(true)
    const typed = String(focused.value).toLowerCase()
    let list = []
    if(focused.name === 'dimension') {
      list = dimChoices().map(function(d) { return { name: d.name, value: d.value } })
    } else if(focused.name === 'player') {
      list = gameClients().map(function(c) {
        const name = c.accountName || c.data.name || 'unnamed'
        return { name: `${c.data.name || 'unnamed'}${c.accountName ? ' (' + c.accountName + ')' : ''} in ${c.fsocket.dim[1][1]}`.slice(0, 100), value: name.slice(0, 100) }
      })
    }
    list = list.filter(function(o) { return o.name.toLowerCase().includes(typed) }).slice(0, 25)
    return interaction.respond(list).catch(function() {})
  }

  client.on(Events.InteractionCreate, async function(interaction) {
    if(interaction.isAutocomplete()) { return autocomplete(interaction) }
    if(!interaction.isChatInputCommand()) { return }
    const handler = handlers[interaction.commandName]
    if(!handler || !inGuild(interaction.guild)) {
      return interaction.reply({ content: 'This command only works in the game\'s server.', flags: MessageFlags.Ephemeral }).catch(function() {})
    }
    let result
    try {
      result = await handler(interaction)
    } catch(e) {
      result = `That didn't work: ${e.message}`
    }
    if(typeof result === 'string' || !result) { result = { content: result || 'Done.' } }
    const payload = { content: result.content, embeds: result.embeds, allowedMentions: { parse: [] } }
    try {
      if(interaction.deferred || interaction.replied) {
        await interaction.editReply(payload)
      } else {
        if(!result.shown) { payload.flags = MessageFlags.Ephemeral }
        await interaction.reply(payload)
      }
    } catch(e) {
      console.log('discord: reply failed:', e.message)
    }
    const outcome = result.content ? ' Result: ' + String(result.content).replace(/\s+/g, ' ').slice(0, 200) : ''
    send('commandLogs', `${userLabel(interaction.user)} used ${code(describe(interaction))} in <#${interaction.channelId}>${outcome}`)
  })

  const autoDeleted = new Set()
  const spamState = {}

  const autoModerate = function(message) {
    const content = message.content || ''
    const member = message.member
    if(member && member.permissions.has(PermissionFlagsBits.ManageMessages)) { return }
    const now = Date.now()
    if(content && words.isBad(content)) {
      autoDeleted.add(message.id)
      message.delete().catch(function() {})
      send('profanity', `Discord: ${userLabel(message.author)} in <#${message.channelId}> (deleted): ||${clean(content, 300)}||`)
      return
    }
    const state = spamState[message.author.id] || (spamState[message.author.id] = { times: [], messages: [], words: {}, last: 0 })
    state.last = now
    state.times = state.times.filter(function(t) { return now - t < settings.spamSeconds * 1000 })
    state.times.push(now)
    state.messages.push(message)
    if(state.messages.length > 15) { state.messages.shift() }
    const repeat = content ? words.spam(state.words, content, now) : {}
    let reason = ''
    if(state.times.length >= settings.spamMessages) {
      reason = `sent ${state.times.length} messages in ${settings.spamSeconds} seconds`
    } else if(message.mentions.users.size >= settings.mentionLimit) {
      reason = `mentioned ${message.mentions.users.size} users in one message`
    } else if(repeat.error && repeat.error.startsWith('Muted')) {
      reason = 'kept repeating the same message'
    }
    if(!reason) { return }
    const toDelete = state.messages
    state.times = []
    state.messages = []
    state.words = {}
    for(const m of toDelete) {
      autoDeleted.add(m.id)
      m.delete().catch(function() {})
    }
    let action = `${toDelete.length} message${toDelete.length === 1 ? '' : 's'} deleted`
    if(member && member.moderatable) {
      member.timeout(settings.spamTimeoutMinutes * 60000, `Auto-moderation: ${reason}`).catch(function() {})
      action += `, timed out for ${settings.spamTimeoutMinutes} minutes`
    }
    send('spam', `Discord: ${userLabel(message.author)} ${reason} in <#${message.channelId}> (${action})`)
  }

  setInterval(function() {
    const now = Date.now()
    for(const id in spamState) {
      if(now - spamState[id].last > 60000) { delete spamState[id] }
    }
    if(autoDeleted.size > 1000) { autoDeleted.clear() }
  }, 60000)

  client.on(Events.MessageCreate, function(message) {
    if(!inGuild(message.guild) || message.author.bot || message.system) { return }
    autoModerate(message)
  })

  client.on(Events.MessageDelete, function(message) {
    if(!inGuild(message.guild) || autoDeleted.has(message.id)) { return }
    if(message.partial) {
      return send('chatLogs', `A message in <#${message.channelId}> was deleted (it was sent before the bot started, so its text is unknown)`)
    }
    if(message.author.bot) { return }
    const files = message.attachments.size ? ` with ${message.attachments.size} attachment${message.attachments.size === 1 ? '' : 's'}` : ''
    send('chatLogs', `Message by ${userLabel(message.author)} deleted in <#${message.channelId}>${files}: ${code(message.content, 500)}`)
  })

  client.on(Events.MessageBulkDelete, function(messages, channel) {
    if(!inGuild(channel.guild)) { return }
    const counted = [...messages.keys()].filter(function(id) { return !autoDeleted.has(id) }).length
    if(counted) { send('chatLogs', `${counted} messages were deleted at once in <#${channel.id}>`) }
  })

  client.on(Events.MessageUpdate, function(before, after) {
    if(!inGuild(after.guild) || !after.author || after.author.bot) { return }
    if(!before.partial && before.content === after.content) { return }
    if(after.partial) { return }
    const old = before.partial ? '(unknown, sent before the bot started)' : code(before.content, 400)
    send('chatLogs', `${userLabel(after.author)} edited a message in <#${after.channelId}> (${after.url}). Before: ${old} After: ${code(after.content, 400)}`)
  })

  client.on(Events.GuildMemberAdd, function(member) {
    if(!inGuild(member.guild)) { return }
    send('chatLogs', `${userLabel(member.user)} joined (account created <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`)
    getChannel('welcome').then(function(channel) {
      if(!channel) { return }
      channel.send({
        content: `Welcome to **${clean(member.guild.name, 100)}**, <@${member.id}>! You are member number ${member.guild.memberCount}.`,
        allowedMentions: { users: [member.id] }
      }).catch(function(e) { console.log('discord: welcome message failed:', e.message) })
    })
  })

  client.on(Events.GuildMemberRemove, function(member) {
    if(!inGuild(member.guild)) { return }
    send('chatLogs', `${userLabel(member.user)} left the server`)
  })

  client.on(Events.GuildBanAdd, function(ban) {
    if(!inGuild(ban.guild)) { return }
    send('chatLogs', `${userLabel(ban.user)} was banned${ban.reason ? ': ' + code(ban.reason) : ''}`)
  })

  client.on(Events.GuildBanRemove, function(ban) {
    if(!inGuild(ban.guild)) { return }
    send('chatLogs', `${userLabel(ban.user)} was unbanned`)
  })

  client.on(Events.GuildMemberUpdate, function(before, after) {
    if(!inGuild(after.guild) || before.partial) { return }
    const who = userLabel(after.user)
    if(before.nickname !== after.nickname) {
      send('chatLogs', `${who} changed nickname: ${code(before.nickname || before.user.username)} to ${code(after.nickname || after.user.username)}`)
    }
    const added = after.roles.cache.filter(function(r) { return !before.roles.cache.has(r.id) })
    const removed = before.roles.cache.filter(function(r) { return !after.roles.cache.has(r.id) })
    if(added.size) { send('chatLogs', `${who} got role${added.size === 1 ? '' : 's'} ${added.map(function(r) { return clean(r.name, 50) }).join(', ')}`) }
    if(removed.size) { send('chatLogs', `${who} lost role${removed.size === 1 ? '' : 's'} ${removed.map(function(r) { return clean(r.name, 50) }).join(', ')}`) }
    const wasOut = before.communicationDisabledUntilTimestamp > Date.now()
    const isOut = after.communicationDisabledUntilTimestamp > Date.now()
    if(!wasOut && isOut) { send('chatLogs', `${who} was timed out until <t:${Math.floor(after.communicationDisabledUntilTimestamp / 1000)}:f>`) }
    if(wasOut && !isOut) { send('chatLogs', `${who}'s timeout ended`) }
  })

  client.once(Events.ClientReady, async function() {
    ready = true
    console.log('discord: signed in as', client.user.tag)
    const guild = await client.guilds.fetch(settings.guild).catch(function() { return null })
    if(guild) {
      try {
        await guild.commands.set(commands.map(function(c) { return c.toJSON() }))
      } catch(e) {
        console.log('discord: registering slash commands failed:', e.message)
      }
    } else {
      console.log(`discord: the bot is not in the server ${settings.guild}, invite it first`)
    }
    send('gameStatus', 'Server started')
    setTimeout(function() { updateStatus(false) }, 10000)
    setInterval(function() {
      if(!stopping) { updateStatus(false) }
    }, Math.max(15, settings.statusSeconds) * 1000)
  })

  client.on(Events.Error, function(e) {
    console.log('discord: client error:', e.message)
  })

  setInterval(function() {
    if(!stopping) { flush() }
  }, 2000)

  let lastError = 0, hiddenErrors = 0
  process.on('uncaughtException', function(e) {
    const now = Date.now()
    if(now - lastError < 60000) {
      hiddenErrors ++
      return
    }
    lastError = now
    send('gameStatus', `Server error: ${code(e && e.message || e)}${hiddenErrors ? ` (and ${hiddenErrors} more in the last minute)` : ''}`)
    hiddenErrors = 0
  })

  process.on('SIGINT', function() { shutdown('stopped from the console') })
  process.on('SIGTERM', function() { shutdown('stopped by the system') })

  client.login(token).catch(function(e) {
    console.log('discord: sign in failed:', e.message)
    if(/disallowed intents/i.test(e.message)) {
      console.log('discord: turn on "Server Members Intent" and "Message Content Intent" in the Discord developer portal, under Bot')
    }
  })

  return api
})()
