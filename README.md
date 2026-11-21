# Open-Scenexe

A free, open source tank game that runs in the browser. Shoot shapes and other players, level up, and upgrade your weapon and body on separate paths.

Play on the official server: http://144.91.117.163:22440/

## Host your own server

You can run your own Open-Scenexe server with every gamemode. It updates itself from this repository each time it restarts.

### What you need

- Python 3.8 or newer. The launcher downloads Node.js and the game's packages.
- A computer or VPS that stays on while people play. Windows, Linux and macOS all work, on x64 or ARM.
- For other people to join over the internet: a public IP address and an open TCP port (22443 by default).

### Start it

1. Download this repository. Either click **Code**, then **Download ZIP** on GitHub and unzip it, or run `git clone https://github.com/HamdanProfessional/opensource-scenexe`.
2. Open a terminal in that folder and run:
   - Windows: `python start.py`
   - Linux and macOS: `python3 start.py`
3. The first start takes a minute while it downloads Node.js. When it prints `starting server`, open `http://localhost:22443/` in your browser.

To stop the server, press Ctrl+C in the terminal.

### Updates

Every time `start.py` starts, it downloads the newest version of the game from GitHub and installs it. Your `config.json` is never overwritten, and files that are not part of the repository (accounts, logs, `.env`) are left alone. To skip the update for one start, run `python start.py --no-update`.

If you cloned the repository with git, the launcher sees the `.git` folder and does not update by itself. Run `git pull` to update instead, or delete the `.git` folder to let the launcher handle it.

### Let other people join

1. Open the port in your firewall, and on a home network forward it on your router to the computer running the server. The default port is 22443.
2. Give people your address: `http://YOUR_PUBLIC_IP:22443/`.

On a VPS you usually only need the firewall step.

### config.json

Every setting is optional.

| Key | What it does | Default |
| --- | --- | --- |
| `port` | The port players connect to. | `22443` |
| `internalPortBase` | First of the internal ports used between the server and the gamemodes. It uses this port and the next 9. Change it if those ports are taken. | `9030` |
| `debug` | `1` prints more information in the terminal. `0` is quieter. | `1` |
| `network` | Updates sent per second for each kind of object (`sendRate`, `nearTanks`, `farTanks` and so on). | The values in the shipped `config.json` |
| `serverList` | Puts your server on the in-game server list. See below. | - |
| `discord` | Settings for the optional Discord bot. See below. | - |

You can also set the port with the `SERVER_PORT` environment variable, which wins over `config.json`. Many game server panels set it for you.

### Get on the server list

Players can press **Servers** under the Play button to see every listed server and join one. To list yours, add this to `config.json`:

```json
"serverList": {
  "name": "My Server",
  "address": "123.45.67.89:22443"
}
```

- `name` is what players see. Keep it short and clean, or it will be replaced.
- `address` is how players reach your server from the internet: your public IP or domain, plus the port. Do not use `localhost` or a `192.168.x.x` address.

When the server starts, it tells the official server about itself and repeats that every minute. The official server checks that your address really answers before listing it, and drops it 3 minutes after your server goes offline. The terminal prints `server list: listed on ...` when it worked, or the reason when it did not, most often that the port is not open from the internet.

### Discord bot (optional)

The server can run a Discord bot that posts game logs, server status, chat moderation alerts and update notes, and adds moderation slash commands.

1. Create an application and a bot at https://discord.com/developers/applications. Under **Bot**, turn on the **Server Members** and **Message Content** intents.
2. Invite the bot to your Discord server with this link, with your application ID in place of `YOUR_APP_ID`: `https://discord.com/oauth2/authorize?client_id=YOUR_APP_ID&scope=bot+applications.commands&permissions=8`
3. Create a file named `.env` next to `start.py` containing `DISCORD_TOKEN=your bot token`.
4. In `config.json`, set your own guild and channel IDs:

```json
"discord": {
  "guild": "your server ID",
  "channels": {
    "gameLogs": "",
    "gameStatus": "",
    "profanity": "",
    "spam": "",
    "chatLogs": "",
    "commandLogs": "",
    "welcome": "",
    "updates": "",
    "announcements": ""
  }
}
```

Never share your `.env` file or put your token on GitHub. Without a token the bot simply stays off.

### Staff roles

Staff are set in `command-data.txt`, which the server creates. Give an account a role from the in-game commands or the Discord `/game role` command. Roles are `player`, `mod`, `admin` and `owner`.

## Contributing

Bug reports, ideas and pull requests are welcome. The code is plain JavaScript:

- `client/` is the browser game, joined into one script when the server starts.
- `game/` is the game engine that runs each gamemode.
- `server/` is the web server, accounts, anti-cheat and the Discord bot.
- `dims/` has one file per gamemode.
- `tankData/` has every weapon, body and upgrade path.

## License

MIT. See `LICENSE`.
