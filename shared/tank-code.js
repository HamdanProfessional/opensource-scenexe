const zlib = require('zlib')
const fs = require('fs')
const path = require('path')
const msgpackr = require('msgpackr')

const LIMITS = {
  inflated: 2 * 1024 * 1024,
  nodes: 6000,
  depth: 12,
  firing: 120,
  looks: 64,
  bulletsPerBarrel: 20,
  dronesPerBarrel: 10,
  joints: 200
}

const STATS = {
  maxHealth: { min: 1, max: 1e7, unit: 100 },
  bodyDamage: { min: 0, max: 1e5, unit: 10 },
  movementSpeed: { min: 0, max: 1000, unit: 50 },
  cameraSize: { min: 0.1, max: 100, unit: 10 }
}
const DEFAULT_COLOR = 0x383838
const BEHAVIORS = ['fixed', 'manual', 'constant', 'mouse', 'auto']
const KINDS = { 0: ['bullet', 0], 3: ['custom', 0], 4: ['trap', 1], 5: ['drone', 2] }
const SPOT = ['x', 'y', 'd']
const SHOT_ROWS = [
  ['reload', 'reload', 0.05, 600, 1],
  ['offset', 'offset', 0, 1, 0],
  ['recoil', 'recoil', 0, 20, 0],
  ['speed', 'bulletSpeed', 0, 100, 5],
  ['damage', 'bulletDamage', 0, 10000, 1],
  ['health', 'bulletHealth', 0, 100000, 1],
  ['time', 'bulletTime', 0.05, 120, 2],
  ['size', 'bulletSize', 0.05, 20, 1],
  ['density', 'bulletDensity', 0, 100, 1],
  ['spray', 'bulletSpray', 0, Math.PI, 0],
  ['variance', 'bulletSpeedVariance', 0, 1, 0]
]

const CLIENT_DROP = {
  barrel: ['kind', 'reload', 'offset', 'recoil', 'speed', 'damage', 'health', 'time', 'size', 'density', 'spray', 'variance', 'wall', 'maxDrones', 'visual'],
  section: ['detect', 'forget', 'fromTop'],
  aura: ['damage', 'steal']
}

let decode = function(text) {
  let clean = String(text || '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  if(!clean) { throw new Error('The code is empty.') }
  let raw, value
  try {
    raw = zlib.inflateSync(Buffer.from(clean, 'base64'), { maxOutputLength: LIMITS.inflated })
  } catch(e) {
    throw new Error(e.code === 'ERR_BUFFER_TOO_LARGE' ? 'The code is too big.' : 'That is not a tank code.')
  }
  try {
    value = msgpackr.unpack(raw)
  } catch(e) {
    try { value = JSON.parse(raw.toString()) } catch(e2) { throw new Error('That is not a tank code.') }
  }
  if(!value || typeof value !== 'object' || !Array.isArray(value.render)) {
    throw new Error(value && typeof value === 'object' && value.type ? 'That is an older Scenexe code. Use the tank editor for it.' : 'That is not a tank code.')
  }
  return value
}

let missing = function(v) {
  return v == null || v === '' || typeof v === 'boolean'
}

let num = function(v, min, max, fallback) {
  let n = missing(v) ? NaN : Number(v)
  if(!Number.isFinite(n)) { return fallback }
  return Math.max(min, Math.min(max, n))
}

let round = function(v) {
  return Math.round(v * 10000) / 10000
}

let color = function(v, fallback) {
  if(v === 'inherit' || v === 'inherit-top') { return v }
  let n = missing(v) ? NaN : Number(v)
  return Number.isInteger(n) && n >= 0 && n <= 0xffffff ? n : fallback
}

let text = function(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)
}

let place = function(from, to, keys) {
  for(let i=0;i<keys.length;i++) {
    to[keys[i]] = round(num(from[keys[i]], -100, 100, 0))
  }
}

let layers = function(from, to) {
  to.layer = num(from.layer, -1000, 1000, 0) | 0
  to.renderLayer = num(from.renderLayer, -1000, 1000, 0) | 0
}

let lineWidth = function(n) {
  return n.fixedLineWidth === undefined ? -1 : num(n.fixedLineWidth, 0, 50, 0)
}

let arrange = function(items) {
  let front = [], rest = [], at = -1
  for(let i=0,l=items.length;i<l;i++) {
    let n = items[i]
    if(n.t === 'path' && n.first) {
      front.push(n)
    } else {
      if(at < 0 && n.t === 'polygon' && n.body) { at = rest.length }
      rest.push(n)
    }
  }
  if(at < 0) { return front.concat(rest) }
  let out = front.concat(rest.slice(0, at)), tail = []
  for(let i=at+1,l=rest.length;i<l;i++) {
    (rest[i].t === 'barrel' ? out : tail).push(rest[i])
  }
  out.push(rest[at])
  return out.concat(tail)
}

let reach = function(items, k) {
  let r = 0
  for(let i=0,l=items.length;i<l;i++) {
    let n = items[i], far = 0
    let at = Math.hypot(n.x || 0, n.y || 0)
    if(n.t === 'section') { far = k * at + reach(n.children, k * n.size) }
    if(n.t === 'polygon' || n.t === 'aura') { far = k * (at + Math.max(n.size, n.baseSize || 0)) }
    if(n.t === 'barrel') { far = k * (at + 2 * n.h + n.w) }
    if(n.t === 'path') {
      for(let j=0,m=n.points.length;j<m;j++) {
        far = Math.max(far, k * Math.hypot(n.points[j][0], n.points[j][1]))
      }
    }
    if(far > r) { r = far }
  }
  return r
}

let forClient = function(tank) {
  let strip = function(n) {
    let drop = CLIENT_DROP[n.t] || [], o = {}
    for(let k in n) {
      if(k === 'children') { o.children = n.children.map(strip) }
      else if(drop.indexOf(k) < 0) { o[k] = n[k] }
    }
    return o
  }
  return {
    name: tank.name,
    color: tank.color,
    reach: tank.reach,
    shots: tank.shots,
    render: tank.render.map(strip),
    looks: tank.looks.map(function(look) { return look.map(strip) })
  }
}

let folder = function(dir) {
  let out = Object.create(null)
  if(!fs.existsSync(dir)) { return out }
  let files = fs.readdirSync(dir).filter(function(f) { return f.endsWith('.txt') }).sort()
  for(let i=0,l=files.length;i<l;i++) {
    let name = files[i].slice(0, -4).toLowerCase()
    try {
      let tank = load(fs.readFileSync(path.join(dir, files[i]), 'utf8'))
      out[name] = { tank: tank, json: JSON.stringify(forClient(tank)) }
      if(tank.changed.length) { console.log(`tank code ${name}: ${tank.changed.join(', ')}`) }
    } catch(e) {
      console.log(`tank code ${name} could not load: ${e.message}`)
    }
  }
  return out
}

let load = function(input) {
  let source = typeof input === 'string' ? decode(input) : input
  if(!source || !Array.isArray(source.render)) { throw new Error('That is not a tank code.') }
  let changed = [], nodes = 0, firing = 0
  let looks = [], lookKeys = {}

  let note = function(what) {
    if(changed.indexOf(what) < 0) { changed.push(what) }
  }

  let look = function(code) {
    if(!code || typeof code !== 'object' || !Array.isArray(code.render)) { return -1 }
    let key = JSON.stringify(code.render)
    if(key in lookKeys) { return lookKeys[key] }
    if(looks.length >= LIMITS.looks) {
      note('custom bullet looks past ' + LIMITS.looks)
      return -1
    }
    let tree = arrange(list(code.render, 1, true))
    lookKeys[key] = looks.length
    looks.push(tree)
    return looks.length - 1
  }

  let list = function(items, depth, insideLook) {
    let out = []
    if(!Array.isArray(items)) { return out }
    for(let i=0,l=items.length;i<l;i++) {
      let node = convert(items[i], depth, insideLook)
      if(node) { out.push(node) }
    }
    return out
  }

  let convert = function(n, depth, insideLook) {
    if(!n || typeof n !== 'object') { return null }
    if(nodes >= LIMITS.nodes) {
      note('parts past ' + LIMITS.nodes)
      return null
    }
    nodes ++
    if(n.type === 'section') {
      if(depth >= LIMITS.depth) {
        note('sections nested deeper than ' + LIMITS.depth)
        return null
      }
      let r = n.rotationData || {}
      let behavior = BEHAVIORS.indexOf(r.behavior) >= 0 ? r.behavior : 'fixed'
      let s = {
        t: 'section',
        size: round(num(n.size, 0, 100, 1)),
        turn: behavior === 'manual' ? 'fixed' : behavior,
        relative: r.relative === 'none' ? 'none' : 'parent',
        children: []
      }
      place(n, s, SPOT)
      layers(n, s)
      if(n.overrideColor !== undefined) { s.color = color(n.overrideColor, 'inherit') }
      if(behavior === 'constant') { s.speed = round(num(r.rotationSpeed, -50, 50, 0)) }
      if(behavior === 'auto') {
        s.detect = round(num(r.detectRange, 0, 200, 16))
        s.forget = round(Math.max(s.detect, num(r.forgetRange, 0, 300, s.detect)))
        s.rest = round(num(r.defaultDirection, -100, 100, 0))
        s.fromTop = r.rangeRelative === 'top'
      }
      s.children = arrange(list(n.render, depth + 1, insideLook))
      return s
    }
    if(n.type === 'polygon') {
      let p = n.polygonData || {}
      let shape = {
        t: 'polygon',
        sides: num(p.sides, -20, 40, 0) | 0,
        size: round(num(p.size, 0, 200, 1)),
        color: color(n.color, 'inherit'),
        stroke: num(n.stroke, 0, 100, 30),
        strokeAlpha: num(n.strokeAlpha, 0, 1, 1),
        lineWidth: lineWidth(n),
        body: n.occlude === 'scenexeBaseBase',
        radiant: num(n.overrideRadiant, 0, 10, -1)
      }
      place(p, shape, SPOT)
      layers(n, shape)
      if(shape.sides < 0) { shape.inner = round(num(p.inner, 0, 1, 0.5)) }
      if(p.reverseJoints) { shape.hole = true }
      if(n.gradient && Array.isArray(n.gradient.colors)) {
        shape.gradient = n.gradient.colors.slice(0, 8).map(function(g) {
          return [round(num(g && g.value, 0, 1, 0)), num(g && g.color, 0, 0xffffff, 0) | 0]
        })
      }
      return shape
    }
    if(n.type === 'path') {
      let points = []
      let joints = Array.isArray(n.joints) ? n.joints : []
      for(let i=0,l=Math.min(joints.length, LIMITS.joints);i<l;i++) {
        let j = joints[i]
        if(!j || (j.type !== 'moveTo' && j.type !== 'lineTo')) { continue }
        points.push([round(num(j.x, -100, 100, 0)), round(num(j.y, -100, 100, 0)), j.type === 'moveTo' ? 1 : 0])
      }
      if(joints.length > LIMITS.joints) { note('path points past ' + LIMITS.joints) }
      if(points.length < 2) { return null }
      return {
        t: 'path',
        points: points,
        w: round(num(n.w, 0, 100, 1)),
        h: round(num(n.h, 0, 100, 1)),
        color: color(n.color, 'inherit'),
        stroke: num(n.stroke, 0, 100, 30),
        strokeColor: color(n.strokeColor, -1),
        strokePercent: num(n.strokePercent, 0, 1, 1),
        lineWidth: lineWidth(n),
        radiant: num(n.overrideRadiant, 0, 10, -1),
        first: !!n.reverseOrder
      }
    }
    if(n.type === 'barrel') {
      let d = n.data || {}
      let kind = KINDS[n.btype]
      if(!kind) {
        note('unknown barrel kinds')
        kind = KINDS[0]
      }
      let b = {
        t: 'barrel',
        kind: kind[0],
        shape: kind[1],
        w: round(num(n.w, 0, 100, 0.5)),
        h: round(num(n.h, 0, 100, 1)),
        color: color(n.color, 'inherit'),
        lineWidth: lineWidth(n),
        visual: !!d.visualOnly || insideLook,
        bulletColor: color(d.bulletColor, 'inherit'),
        wall: !!d.wall,
        look: -1
      }
      place(n, b, SPOT)
      for(let i=0;i<SHOT_ROWS.length;i++) {
        let row = SHOT_ROWS[i]
        b[row[0]] = round(num(d[row[1]], row[2], row[3], row[4]))
      }
      if(b.shape === 2) { b.maxDrones = num(n.maxDrones !== undefined ? n.maxDrones : d.maxDrones, 1, LIMITS.dronesPerBarrel, 1) | 0 }
      if(!b.visual && d.bulletCode) { b.look = look(d.bulletCode) }
      if(!b.visual) {
        if(firing >= LIMITS.firing) {
          note('firing barrels past ' + LIMITS.firing + ' (drawn but not fired)')
          b.visual = true
        } else {
          firing ++
        }
      }
      return b
    }
    if(n.type === 'scenexe-aura') {
      let a = {
        t: 'aura',
        size: round(num(n.auraSize, 0, 100, 1)),
        inner: round(num(n.auraInnerSize, 0, 100, 0)),
        sides: num(n.auraSides, -20, 40, 0) | 0,
        baseSize: round(num(n.size, 0, 100, 0)),
        baseSides: num(n.baseSides, -20, 40, 0) | 0,
        color: color(n.auraColor, 'inherit'),
        passiveColor: color(n.auraPassiveColor, 'inherit'),
        alpha: num(n.auraAlpha, 0, 1, 0.3),
        passiveAlpha: num(n.auraPassiveAlpha, 0, 1, 0.1),
        damage: round(num(n.auraDamage, 0, 10000, 0)),
        steal: round(num(n.auraHealthSteal, 0, 1, 0)),
        hideBase: !!n.hideBase,
        hideAura: !!n.hideAura,
        radiant: num(n.overrideRadiant, 0, 10, -1)
      }
      place(n, a, ['x', 'y'])
      return a
    }
    if(n.type !== undefined) { note(`unknown parts (${text(n.type, 20)})`) }
    return null
  }

  let render = arrange(list(source.render, 0, false))
  let shots = [], syncs = 0
  let walk = function(items, k) {
    let needed = false
    for(let i=0,l=items.length;i<l;i++) {
      let n = items[i]
      if(n.t === 'section') {
        if(walk(n.children, k * n.size)) {
          needed = true
          if(n.turn === 'constant' || n.turn === 'auto') { n.sync = syncs ++ }
        }
      } else if(n.t === 'barrel' && !n.visual) {
        shots.push({ kind: n.kind, size: round(n.w * k * n.size), look: n.look })
        needed = true
      } else if(n.t === 'aura' && n.damage > 0) {
        needed = true
      }
    }
    return needed
  }
  walk(render, 1)
  let data = source.data || {}
  let stats = {}
  for(let k in STATS) {
    stats[k] = num(data[k], STATS[k].min, STATS[k].max, STATS[k].unit)
  }
  return {
    name: text(source.name, 50),
    stats: stats,
    color: num(data.color, 0, 0xffffff, DEFAULT_COLOR) | 0,
    render: render,
    looks: looks,
    reach: round(reach(render, 1)),
    shots: shots,
    changed: changed
  }
}

module.exports = { decode, load, folder, forClient, LIMITS, STATS }
