const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const EventEmitter = require('events')
const { pack, unpack } = require('msgpackr')

const root = path.join(__dirname, '..')
const tankCode = require(path.join(root, 'shared/tank-code.js'))

const encode = function(value, json) {
  const raw = json ? Buffer.from(JSON.stringify(value)) : pack(value)
  return zlib.deflateSync(raw).toString('base64')
}

const realCode = function() {
  return fs.readFileSync(path.join(root, 'tankData/codes/unknow-remaster.txt'), 'utf8')
}

const barrel = function(btype, extra) {
  return Object.assign({ type: 'barrel', btype: btype, x: 0, y: 0, d: 0, w: 0.4, h: 1, data: { reload: 1, bulletSpeed: 5, bulletDamage: 1, bulletHealth: 5, bulletTime: 2, bulletSize: 1 } }, extra || {})
}

const section = function(behavior, render, extra) {
  return Object.assign({ type: 'section', x: 0, y: 0, d: 0, size: 1, rotationData: { behavior: behavior, relative: 'parent' }, render: render }, extra || {})
}

const polygon = function(extra) {
  return Object.assign({ type: 'polygon', color: 0x383838, polygonData: { sides: 0, size: 1, d: 0 } }, extra || {})
}

const mul = function(m, n) {
  return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]
}

const renderer = function(codes) {
  let M = [1, 0, 0, 1, 0, 0], points = []
  const ops = []
  const at = (x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]]
  const ctx = {
    fillStyle: '', strokeStyle: '', lineWidth: 1, lineJoin: '', lineCap: '', globalAlpha: 1,
    getTransform() { return { a: M[0], b: M[1], c: M[2], d: M[3], e: M[4], f: M[5] } },
    setTransform(a, b, c, d, e, f) { M = typeof a === 'object' ? [a.a, a.b, a.c, a.d, a.e, a.f] : [a, b, c, d, e, f] },
    translate(x, y) { M = mul(M, [1, 0, 0, 1, x, y]) },
    rotate(t) { M = mul(M, [Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), 0, 0]) },
    scale(x, y) { M = mul(M, [x, 0, 0, y, 0, 0]) },
    beginPath() { points = [] },
    moveTo(x, y) { points.push(at(x, y)) },
    lineTo(x, y) { points.push(at(x, y)) },
    arc(x, y, r) { points.push(at(x - r, y), at(x + r, y), at(x, y - r), at(x, y + r)) },
    closePath() {},
    fill() { ops.push({ op: 'fill', points: points.slice() }) },
    stroke() { ops.push({ op: 'stroke', points: points.slice() }) },
    createRadialGradient() { return { addColorStop() {} } }
  }
  global.fetch = function(url) {
    const name = decodeURIComponent(String(url).split('n=')[1] || '')
    if(!(name in codes)) { return Promise.resolve({ ok: false, json: () => Promise.resolve({}) }) }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(codes[name])) })
  }
  const source = fs.readFileSync(path.join(root, 'client/15b-render-code-tanks.js'), 'utf8')
  const render = new Function('ctx', `return {
    lineWidth: 5, now: 0, drawAlpha: 1,
    barrelData: { 0: [{ points: [[[-0.5, 0], [-0.5, 1], [0.5, 1], [0.5, 0]]] }], 1: [{ points: [[[-0.5, 0], [-0.5, 1], [0.5, 1], [0.5, 0]]] }], 2: [{ points: [[[-0.5, 0], [-0.5, 1], [0.5, 1], [0.5, 0]]] }] },
    rgb(c, a) { return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (a >= 0 ? a : 1) + ')' },
    darken(c, a) { a = a || 30; return { r: Math.max(0, c.r - a), g: Math.max(0, c.g - a), b: Math.max(0, c.b - a) } },
    averageColors(a, b, t) { return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t } },
    slide(a, b, t) { return a + (b - a) * t },
    ${source}
  }`)(ctx)
  global.render = render
  const load = function(name) {
    render.codeTank(name)
    return new Promise(resolve => setTimeout(resolve, 5))
  }
  const bounds = function(list) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for(const o of list) {
      for(const p of o.points) {
        minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0])
        minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1])
      }
    }
    return { minX, minY, maxX, maxY }
  }
  return { render, ctx, ops, load, bounds, matrix: () => M.slice() }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const engine = function(port) {
  process.chdir(root)
  const quiet = console.log
  console.log = function() {}
  const sc = require(path.join(root, 'engine.js'))
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'))
  const posted = []
  const data = sc.run({ port: port, start: "load('./dims/ffa.js')", network: cfg.network, secret: {}, parentPort: { postMessage(m) { posted.push(m) } } })
  const codes = data.game.codes
  const client = function(uid, name, role) {
    const ws = new EventEmitter()
    ws._headers = { 'openscenexe-uid': String(uid), 'openscenexe-lastteam': '-1' }
    ws.packets = []
    ws.readyState = 1
    ws.send = function(buf) {
      if(buf[0] === 0x92 && buf[1] === codes.receive.gameUpdate) { return }
      try { ws.packets.push(unpack(buf)) } catch(e) {}
    }
    ws.close = function() { if(ws.closed) { return } ws.closed = true; ws.emit('close') }
    ws.terminate = ws.close
    data.server.emit('connection', ws)
    ws.say = function(type, payload) { ws.emit('message', pack([codes.send[type], payload])) }
    ws.chat = function(text) { ws.say('chat', text) }
    ws.notes = function() { return ws.packets.filter(p => p[0] === codes.receive.announcement).map(p => String(p[1])) }
    ws.clearNotes = function() { ws.packets = ws.packets.filter(p => p[0] !== codes.receive.announcement) }
    ws.join = function() { ws.say('joinGame', [name, 'ffa', [], [false, 0], { role: role }, '']) }
    return ws
  }
  return { data, client, posted, ffa: data.dimension.dims.ffa, dimension: data.dimension, commands: data.commands, restoreLog: () => { console.log = quiet } }
}

module.exports = { root, tankCode, encode, realCode, barrel, section, polygon, renderer, engine, wait }
