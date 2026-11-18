const fs = require('fs')
const path = require('path')
const { SOURCES, loadOrderFor, cacheDirFor, fetchAll } = require('./fetch.js')
const { loadOsa } = require('./sandbox.js')
const { makeConverter, RENAMES } = require('./convert.js')

const ROOT = path.join(__dirname, '..', '..')
const TANK_DATA = path.join(ROOT, 'tankData')
const SOURCE = 'open-source-arras'
const DEFS = 'server/lib/definitions/'
const EXTRA_GROUPS = ['groups/food.js']
const EXTRA_TANKS = ['special', 'retrograde', 'armsRace', 'nostalgia', 'scrapped', 'menus'].map(function(f) { return 'groups/tanks/' + f + '.js' })
const ARMS_RACE = 'groups/tanks/armsRace.js'
const BETTER_ARMS_RACE = 'entityAddons/betterArmsRace/tanks.js'
const FORK = 'broken-arras'
const FORK_ADDON = 'groups/armsRaceTanks.js'
const FORK_ADDON_FILE = 'server/lib/definitions/entityAddons/armsRace/tanks.js'
const LEVEL_PER_TIER = 10

const loadFork = function(offline) {
  const sha = SOURCES[FORK].sha
  const cacheDir = cacheDirFor(sha)
  const target = path.join(cacheDir, DEFS, FORK_ADDON)
  if(!fs.existsSync(target)) {
    const text = fs.readFileSync(path.join(cacheDir, FORK_ADDON_FILE), 'utf8').split('\n').filter(function(line) { return !/menu_unused/.test(line) }).join('\n')
    fs.writeFileSync(target, text)
  }
  return loadOsa(cacheDir, loadOrderFor(FORK).concat([FORK_ADDON]), { arms_race: true, level_cap: 120, level_cap_cheat: 120 })
}

const WIKI = path.join(__dirname, 'wiki')

const escapeRegExp = function(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const restoreCensorFlags = function(table, keys, flagged) {
  const words = flagged.map(function(k) { return { label: String(table[k].LABEL || ''), rename: RENAMES[k] } }).filter(function(w) { return w.label }).sort(function(a, b) { return b.label.length - a.label.length })
  for(const k of keys) {
    const own = table[k]
    if(!Object.prototype.hasOwnProperty.call(own, 'DMCA_CENSOR_NAME') || own.DMCA_CENSOR_NAME) { continue }
    let label = String(own.LABEL || k)
    for(const w of words) {
      label = label.replace(new RegExp('(^|[^A-Za-z])' + escapeRegExp(w.label) + '(?![A-Za-z])', 'g'), function(m, lead) { return lead + w.rename })
    }
    own.DMCA_CENSOR_NAME = true
    own.DMCA_CENSOR_DESIGN = true
    RENAMES[k] = label
  }
}

const loadWikiTanks = function(osa) {
  const links = []
  const loaded = []
  const created = []
  if(!fs.existsSync(WIKI)) { return { loaded, created, links: 0, missingLinks: [] } }
  const flagged = Object.keys(osa.classTable).filter(function(k) { return osa.classTable[k].DMCA_CENSOR_NAME === true && RENAMES[k] })
  const tiers = fs.readdirSync(WIKI).filter(function(d) { return /^tier\d+$/.test(d) }).sort(function(a, b) { return parseInt(a.slice(4)) - parseInt(b.slice(4)) })
  for(const dir of tiers) {
    const tier = parseInt(dir.slice(4))
    const files = fs.readdirSync(path.join(WIKI, dir)).filter(function(f) { return f.endsWith('.js') }).sort().map(function(f) { return path.join(WIKI, dir, f) })
    const upgrade = function(parents, child) {
      for(const parent of [].concat(parents)) { links.push({ parent, child, tier }) }
    }
    for(const file of files) {
      const before = Object.assign({}, osa.classTable)
      const ok = osa.extend([file], { upgrade }).length
      const replaced = Object.keys(before).filter(function(k) { return osa.classTable[k] !== before[k] })
      for(const k of replaced) { osa.classTable[k] = before[k] }
      if(replaced.length) { osa.failures.push({ file: path.basename(file), error: 'replaces existing class ' + replaced.join(', ') }) }
      if(ok && !replaced.length) { loaded.push(path.basename(file, '.js')) }
      for(const k of Object.keys(osa.classTable)) { if(!(k in before)) { created.push(k) } }
    }
  }
  const table = osa.classTable
  restoreCensorFlags(table, created, flagged)
  const missingLinks = []
  let added = 0
  for(const link of links) {
    const own = table[link.parent]
    if(!own || !table[link.child]) { missingLinks.push(link.parent + ' -> ' + link.child); continue }
    const key = 'UPGRADES_TIER_' + (link.tier - 1)
    const list = Array.isArray(own[key]) ? own[key].slice() : []
    if(!list.includes(link.child)) { list.push(link.child); added++ }
    own[key] = list
  }
  return { loaded, created, links: added, missingLinks }
}

const forkName = function(name) {
  return name.replace(/^PLACEHOLDER_/, '').replace(/_AR$/, '')
}

const addForkTanks = function(table, forkTable) {
  const lower = {}
  for(const name of Object.keys(table)) { lower[name.toLowerCase()] = name }
  const target = function(name) {
    const short = forkName(name)
    return lower[short.toLowerCase()] || short
  }
  let added = 0, links = 0
  for(const name of Object.keys(forkTable)) {
    const def = forkTable[name]
    if(!def || typeof def !== 'object' || def.PLACEHOLDER) { continue }
    if(!(name in table)) { table[name] = def }
    const short = target(name)
    if(!(short in table)) { table[short] = def; lower[short.toLowerCase()] = short; added++ }
  }
  for(const name of Object.keys(forkTable)) {
    const def = forkTable[name]
    if(!def || typeof def !== 'object' || def.PLACEHOLDER) { continue }
    const own = table[target(name)]
    if(!own) { continue }
    for(let tier = 0; tier <= 9; tier++) {
      const list = def['UPGRADES_TIER_' + tier]
      if(!Array.isArray(list)) { continue }
      const mine = (Array.isArray(own['UPGRADES_TIER_' + tier]) ? own['UPGRADES_TIER_' + tier] : []).map(function(e) { return typeof e === 'string' && table[target(e)] ? target(e) : e }).filter(function(e, i, a) { return a.indexOf(e) === i })
      for(const entry of list) {
        if(typeof entry !== 'string') { continue }
        const t = target(entry)
        if(!table[t] || mine.includes(t) || t === target(name)) { continue }
        mine.push(t)
        links++
      }
      own['UPGRADES_TIER_' + tier] = mine
    }
  }
  return { added, links }
}

const gunPosition = function(position) {
  let p = position
  if(Array.isArray(p)) { p = { LENGTH: p[0], WIDTH: p[1], ASPECT: p[2], X: p[3], Y: p[4], ANGLE: p[5], DELAY: p[6] } }
  p = p || {}
  return {
    L: p.LENGTH === undefined ? 18 : p.LENGTH,
    W: p.WIDTH === undefined ? 8 : p.WIDTH,
    A: p.ASPECT === undefined ? 1 : p.ASPECT,
    X: p.X || 0,
    Y: p.Y || 0,
    ANGLE: p.ANGLE || 0
  }
}

const completeGuns = function(table) {
  const converter = makeConverter(table, {})
  const templateOf = function(name, pick) {
    const guns = converter.resolve(name).GUNS || []
    const gun = guns.filter(function(g) { return g.PROPERTIES && g.PROPERTIES.SHOOT_SETTINGS }).find(pick || function() { return true })
    return gun && gun.PROPERTIES
  }
  const templates = {
    basic: templateOf('basic'),
    sniper: templateOf('sniper'),
    machine: templateOf('machineGun'),
    trap: templateOf('trapper'),
    drone: templateOf('overseer')
  }
  const fires = function(def, depth) {
    if(!def || depth > 6) { return false }
    if((def.GUNS || []).some(function(g) { return g.PROPERTIES && g.PROPERTIES.SHOOT_SETTINGS })) { return true }
    return (def.TURRETS || []).some(function(t) {
      const type = Array.isArray(t.TYPE) ? t.TYPE[0] : t.TYPE
      return fires(typeof type === 'string' ? converter.resolve(type) : type, depth + 1)
    })
  }
  const done = []
  for(const name of converter.reachableFrom('basic')) {
    const resolved = converter.resolve(name)
    const placeholder = resolved.UPGRADE_COLOR === 'black' || resolved.UPGRADE_COLOR === 'pureBlack'
    if(fires(resolved, 0) && !placeholder) { continue }
    const guns = resolved.GUNS || []
    const pos = guns.map(function(g) { return gunPosition(g.POSITION) })
    const role = pos.map(function(p) {
      if(p.W < 4 || p.L < 2 || p.A < 0) { return null }
      if(p.A >= 1.25 && p.L <= 6) { return 'trap' }
      if(p.A >= 1.05 && p.A < 1.6 && p.L <= 10 && p.W >= 7) { return 'drone' }
      if(p.L >= 22) { return 'sniper' }
      if(p.A >= 1.25) { return 'machine' }
      return 'basic'
    })
    pos.forEach(function(p, i) {
      if(role[i] !== 'trap') { return }
      pos.forEach(function(q, j) {
        if(j !== i && role[j] && role[j] !== 'trap' && q.ANGLE === p.ANGLE && Math.abs(q.Y - p.Y) < 1 && Math.abs(q.X + q.L - p.X) <= 2) { role[j] = null }
      })
    })
    if(!role.some(Boolean)) { continue }
    const own = table[name]
    own.GUNS = guns.map(function(g, i) {
      if(g.PROPERTIES && g.PROPERTIES.SHOOT_SETTINGS) { return g }
      if(!role[i] || !templates[role[i]]) { return g }
      return Object.assign({}, g, { PROPERTIES: templates[role[i]] })
    })
    own.UPGRADE_COLOR = undefined
    own.UPGRADE_TOOLTIP = undefined
    done.push(name)
  }
  return done
}

const loadTankData = function() {
  return require(path.join(TANK_DATA, 'index.js')).load()
}

const writeEntries = function(file, target, entries) {
  let text = '_(' + target + ', {\n'
  for(const key of Object.keys(entries)) {
    text += '  ' + JSON.stringify(key).replace(/^"|"$/g, "'") + ': ' + JSON.stringify(entries[key]) + ',\n'
  }
  text += '})\n'
  fs.writeFileSync(file, text)
}

const loadAll = async function(offline) {
  const sha = SOURCES[SOURCE].sha
  const extra = EXTRA_GROUPS.concat(EXTRA_TANKS, [BETTER_ARMS_RACE]).map(function(f) { return DEFS + f })
  const cacheDir = offline ? cacheDirFor(sha) : await fetchAll(SOURCE, sha, extra)
  const base = loadOrderFor(SOURCE)
  const order = base.slice(0, 3).concat(EXTRA_GROUPS, base.slice(3, 4), EXTRA_TANKS, base.slice(4))
  const transforms = {}
  transforms[path.basename(ARMS_RACE)] = function(text) {
    return text.replace('const free_tier_4 = true', 'const free_tier_4 = false').replace('const enable_missing_tanks = false', 'const enable_missing_tanks = true')
  }
  const osa = loadOsa(cacheDir, order.concat([BETTER_ARMS_RACE]), { arms_race: true, level_cap: 120, level_cap_cheat: 120 }, true, transforms)
  const fork = loadFork(offline)
  const forkReport = addForkTanks(osa.classTable, fork.classTable)
  const wikiReport = loadWikiTanks(osa)
  const completed = completeGuns(osa.classTable)
  return { osa, fork, forkReport, wikiReport, completed }
}

const run = async function() {
  const offline = process.argv.includes('--offline')
  const { osa, fork, forkReport, wikiReport, completed } = await loadAll(offline)
  const report = {}
  const converter = makeConverter(osa.classTable, report)

  for(const f of ['weapons/9-arras_race.js', 'bodies/9-arras_race.js', 'upgrades/arras_race.js']) {
    if(fs.existsSync(path.join(TANK_DATA, f))) { fs.unlinkSync(path.join(TANK_DATA, f)) }
  }
  const current = loadTankData()
  const reachable = converter.reachableFrom('basic')
  const candidates = {}
  for(const name of reachable) {
    const key = 'arras:' + name
    if(key in current.weapons) { continue }
    const out = converter.convertTank(name)
    if(!out) { continue }
    candidates[out.key] = out
  }

  const fullMap = converter.buildUpgradeMap(reachable)
  const weaponOf = function(key) { return candidates[key] ? candidates[key].weapon : current.weapons[key] }
  const bodyOf = function(key) { return candidates[key] ? candidates[key].body : current.bodies[key] }
  const firingBarrels = function(node) {
    if(!node || typeof node !== 'object') { return 0 }
    let n = 0
    if(Array.isArray(node.barrels)) {
      n += node.barrels.filter(function(b) { return !(b.type === 6 || b.type === 7 || b.type > 9) }).length
    }
    n += firingBarrels(node.sectionWeapon)
    for(const k of ['weaponTurrets', 'turrets']) {
      if(Array.isArray(node[k])) { node[k].forEach(function(t) { n += firingBarrels(t) }) }
    }
    return n
  }
  const attacks = function(key) { return firingBarrels(weaponOf(key)) + firingBarrels(bodyOf(key)) > 0 }
  const parents = {}
  for(const key of Object.keys(fullMap)) {
    for(const target of fullMap[key].upgrades) { (parents[target] = parents[target] || []).push(key) }
  }
  const dropped = []
  const unfinished = function(key) {
    if(!candidates[key]) { return false }
    if(wikiReport.created.includes(key.slice('arras:'.length))) { return false }
    const color = converter.resolve(key.slice('arras:'.length)).UPGRADE_COLOR
    if(color === 'black' || color === 'pureBlack') { return true }
    if(attacks(key)) { return false }
    return (parents[key] || []).every(function(p) { return attacks(p) })
  }
  const kept = new Set(['arras:basic'])
  const queue = ['arras:basic']
  while(queue.length) {
    const key = queue.shift()
    for(const target of (fullMap[key] || { upgrades: [] }).upgrades) {
      if(kept.has(target)) { continue }
      if(unfinished(target)) { if(!dropped.includes(target)) { dropped.push(target) } continue }
      kept.add(target)
      queue.push(target)
    }
  }
  const weapons = {}
  const bodies = {}
  for(const key of Object.keys(candidates)) {
    if(!kept.has(key)) { continue }
    weapons[key] = candidates[key].weapon
    bodies[key] = candidates[key].body
  }

  const known = new Set(Object.keys(current.weapons).filter(function(k) { return k.startsWith('arras:') && kept.has(k) || k.startsWith('arras:') && !candidates[k] }).concat(Object.keys(weapons)))
  const merged = {}
  let added = 0
  for(const key of Object.keys(fullMap)) {
    if(!known.has(key)) { continue }
    const existing = current.weaponUpgradeMap[key]
    const upgrades = existing ? existing.upgrades.slice() : []
    const levels = existing ? (existing.levels || existing.upgrades.map(function() { return existing.level })).slice() : []
    const entry = fullMap[key]
    entry.upgrades.forEach(function(target, i) {
      if(!known.has(target) || upgrades.includes(target)) { return }
      upgrades.push(target)
      levels.push(entry.levels[i] / 15 * LEVEL_PER_TIER)
      added++
    })
    if(upgrades.length && (!existing || upgrades.length > existing.upgrades.length)) {
      merged[key] = { level: Math.min.apply(null, levels), upgrades, levels }
    }
  }

  writeEntries(path.join(TANK_DATA, 'weapons', '9-arras_race.js'), 'weapons', weapons)
  writeEntries(path.join(TANK_DATA, 'bodies', '9-arras_race.js'), 'bodies', bodies)
  writeEntries(path.join(TANK_DATA, 'upgrades', 'arras_race.js'), 'weaponUpgradeMap', merged)

  console.log('loader failures: ' + JSON.stringify(osa.failures.concat(fork.failures)).slice(0, 800))
  console.log('fork tanks added: ' + forkReport.added + ', fork links: ' + forkReport.links + ', completed guns: ' + completed.length)
  console.log('completed: ' + completed.join(' '))
  console.log('wiki tanks loaded: ' + wikiReport.loaded.length + ', wiki links: ' + wikiReport.links + (wikiReport.missingLinks.length ? ', missing links: ' + wikiReport.missingLinks.join(', ') : ''))
  console.log('reachable: ' + reachable.length + ', new tanks: ' + Object.keys(weapons).length + ', upgrade entries: ' + Object.keys(merged).length + ', new upgrade links: ' + added)
  console.log('dropped unfinished: ' + dropped.length + ', unreachable after drop: ' + (Object.keys(candidates).length - Object.keys(weapons).length - dropped.length))
  console.log('dropped: ' + dropped.map(function(k) { return k.slice('arras:'.length) }).join(' '))
  for(const bucket of Object.keys(report)) {
    console.log(bucket + ': ' + JSON.stringify(report[bucket]).slice(0, 600))
  }
}

module.exports = { loadAll }

if(require.main === module) {
  run().catch(function(err) {
    console.error(err)
    process.exit(1)
  })
}
