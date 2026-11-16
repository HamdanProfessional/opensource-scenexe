const { pack, unpack } = require("msgpackr");
const WebSocket = require("ws"), { WebSocketServer } = WebSocket;
const fs = require("fs");
const http = require('http');
const url = require('url');
const { Worker } = require('worker_threads');
const { Accounts, achievements, SHA256, createAchievement, updateGallery } = require('./accounts.js');
const words = require('./shared/words.js');

const commandDataPath = 'command-data.txt'
const staffRoles = ['player', 'mod', 'admin', 'owner']
let commandData = {
  data: {},
  get: function() {
    try {
      commandData.data = JSON.parse(fs.readFileSync(commandDataPath).toString() || '{}')
    } catch(e) { if(e.code !== 'ENOENT') { console.log('command-data.txt:', e.message) } }
  },
  set: function() {
    fs.writeFileSync(commandDataPath, JSON.stringify(commandData.data, null, 2))
  },
  role: function(accountName) {
    let d = accountName && commandData.data[String(accountName).toLowerCase()]
    return d && staffRoles.indexOf(d.role) > 0 ? d.role : 'player'
  },
  level: function(accountName) {
    return staffRoles.indexOf(commandData.role(accountName))
  }
}

commandData.get()
setInterval(commandData.get, 30000)

fs.readFileSync = new Proxy(fs.readFileSync, { apply:function(a, b, c) {
  return Reflect.apply(a, b, c)
} })

fs.writeFileSync = new Proxy(fs.writeFileSync, { apply:function(a, b, c) {
  return Reflect.apply(a, b, c)
} })

const { btoa } = require("buffer");

let clients = []

let workerFile = './worker.js'
let engineFile = './engine.js'
let tankDataDir = './tankData'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_NO_WARNINGS = 1

let config = {}
try { config = JSON.parse(fs.readFileSync('./config.json').toString()) } catch(e) { if(e.code !== 'ENOENT') { console.log('config.json:', e.message) } }
const envNum = function(name) { return process.env[name] !== undefined && process.env[name] !== '' ? Number(process.env[name]) : undefined }
let debug = envNum('DEBUG') ?? config.debug ?? 1
let fobs = envNum('OBFUSCATE') ?? config.obfuscate ?? 0
console.log(debug ? 'Running on debug mode' : 'Running on normal mode')

const cachedFiles = {
  robots: fs.readFileSync('./robots.txt').toString(),
  logo: fs.readFileSync('./logo.svg').toString(),
  changelog: fs.readFileSync('./changelog.txt').toString(),
  sitemap: fs.readFileSync('./sitemap.txt').toString()
}

const args = {
  port: Number(process.env.SERVER_PORT || process.env.PORT) || config.port || (debug ? 22443 : 443),
  testing: 0,
}

const secret = {}

const tankData = require(require('path').resolve(tankDataDir, 'index.js')).load()

console.log = new Proxy(console.log, { apply:function(a, b, c) {
  const now = new Date()
  c.unshift(`[${now.toDateString()} ${now.toTimeString().split(' ')[0]}]`)
  return Reflect.apply(a, b, c)
} })

const hex = function(o) {
  return `0x${o.toString(16)}`
}

