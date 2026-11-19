const { pack, unpack } = require("msgpackr");
const WebSocket = require("ws"), { WebSocketServer } = WebSocket;
const fs = require("fs");
const http = require(typeof __dirname === undefined ? 'http' : 'http');
const url = require('url');
const perf_hooks = require('perf_hooks');
const _performance = perf_hooks.performance;

const commandLogs = fs.createWriteStream(require("path").join(__dirname, "commandlogs.txt"), { flags:'a' });
commandLogs.on("error", e => console.warn("[commandlogs] disabled:", e.code || e.message));

let secret = {}

const native = (function() {
  try { return require('./native/index.js') } catch(e) { return null }
})()

const words = require('./shared/words.js')
const checkName = function(str) {
  return !words.isBad(str)
}

const prefix = [
  'Radiant',
  'Gleaming',
  'Luminous',
  'Lustrous',
  'Highly Radiant',
  'Red',
  'Blue',
  'Green',
  'Purple',
  'Pink',
  'Shiny',
  'Miscolored',
  'Misshapen',
  'Fat'
], aiNames = [
  "Triangle",
  "Square",
  "Pentagon",
  "Hexagon",
  "Heptagon",
  "Octagon",
  "Nonagon",
  "Decagon",
  'Celestial',
  'Polygon',
  'Wormhole',
  'Rift',
  'Wall',
  'Gate',
  'Base',
  'Tank',
  'Bullet',
  'Trap',
  'Drone',
  'Minion',
  'Rocket',
  'Polyp',
  'Turret',
  'Barrel',
  'Aura'
]

let createAchievement = function(id) {
  return {
    time: Math.floor(Date.now() / 1000),
    id: id
  }
}


console.log = new Proxy(console.log, { apply:function(a, b, c) {
  const now = new Date()
  c.unshift(`[${now.toDateString()} ${now.toTimeString().split(' ')[0]}]`)
  return Reflect.apply(a, b, c)
} })


