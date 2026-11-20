const zlib = require('zlib')

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

const BEHAVIORS = ['fixed', 'manual', 'constant', 'mouse', 'auto']
const KINDS = { 0: 'bullet', 3: 'custom', 4: 'trap', 5: 'drone' }

const decode = function(text) {
  const clean = String(text || '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  if(!clean) { throw new Error('The code is empty.') }
  let raw
  try {
    raw = zlib.inflateSync(Buffer.from(clean, 'base64'), { maxOutputLength: LIMITS.inflated })
  } catch(e) {
    throw new Error(e.code === 'ERR_BUFFER_TOO_LARGE' ? 'The code is too big.' : 'That is not a tank code.')
  }
  let value
  try {
    value = require('msgpackr').unpack(raw)
  } catch(e) {
    try { value = JSON.parse(raw.toString()) } catch(e2) { throw new Error('That is not a tank code.') }
  }
  if(!value || typeof value !== 'object' || !Array.isArray(value.render)) {
    throw new Error(value && typeof value === 'object' && value.type ? 'That is an older Scenexe code. Use the tank editor for it.' : 'That is not a tank code.')
  }
  return value
}

const num = function(v, min, max, fallback) {
  const n = Number(v)
  if(!Number.isFinite(n)) { return fallback }
  return Math.max(min, Math.min(max, n))
}

const round = function(v) {
  return Math.round(v * 10000) / 10000
}

const color = function(v, fallback) {
  if(v === 'inherit' || v === 'inherit-top') { return v }
  const n = Number(v)
  return Number.isInteger(n) && n >= 0 && n <= 0xffffff ? n : fallback
}

const text = function(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)
}

const arrange = function(items) {
  const firstBody = items.findIndex(n => n.t === 'polygon' && n.body)
  const front = items.filter(n => n.t === 'path' && n.first)
  let rest = items.filter(n => !(n.t === 'path' && n.first))
  if(firstBody >= 0) {
    const at = rest.findIndex(n => n.t === 'polygon' && n.body)
    const late = rest.filter((n, i) => i > at && n.t === 'barrel')
    rest = rest.filter((n, i) => !(i > at && n.t === 'barrel'))
    rest.splice(at, 0, ...late)
  }
  return front.concat(rest)
}

const number = function(render) {
  const shots = []
  let syncs = 0
  const walk = function(items, k) {
    let fires = false
    for(const n of items) {
      if(n.t === 'section') {
        if(walk(n.children, k * n.size)) {
          fires = true
          if(n.turn === 'constant' || n.turn === 'auto') { n.sync = syncs ++ }
        }
      } else if(n.t === 'barrel' && !n.visual) {
        n.fire = shots.length
        shots.push({ kind: n.kind, size: round(n.w * k * n.size), look: n.look })
        fires = true
      }
    }
    return fires
  }
  walk(render, 1)
  return { shots: shots, syncs: syncs }
}

const reach = function(items, k) {
  let r = 0
  for(const n of items) {
    let far = 0
    const at = Math.hypot(n.x || 0, n.y || 0)
    if(n.t === 'section') { far = k * at + reach(n.children, k * n.size) }
    if(n.t === 'polygon' || n.t === 'aura') { far = k * (at + Math.max(n.size, n.baseSize || 0)) }
    if(n.t === 'barrel') { far = k * (at + 2 * n.h + n.w) }
    if(n.t === 'path') { far = k * Math.max(...n.points.map(p => Math.hypot(p[0], p[1]))) }
    if(far > r) { r = far }
  }
  return r
}

const CLIENT_DROP = {
  barrel: ['reload', 'offset', 'recoil', 'speed', 'damage', 'health', 'time', 'size', 'density', 'spray', 'variance', 'wall', 'maxDrones', 'visual'],
  section: ['detect', 'forget', 'fromTop'],
  aura: ['damage', 'steal']
}

const forClient = function(tank) {
  const strip = function(n) {
    const drop = CLIENT_DROP[n.t] || []
    const o = {}
    for(const k in n) {
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
    looks: tank.looks.map(l => l.map(strip))
  }
}

const folder = function(dir) {
  const fs = require('fs'), path = require('path')
  const out = Object.create(null)
  if(!fs.existsSync(dir)) { return out }
  for(const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt')).sort()) {
    const name = f.slice(0, -4).toLowerCase()
    try {
      const tank = load(fs.readFileSync(path.join(dir, f), 'utf8'))
      const json = JSON.stringify(forClient(tank))
      out[name] = { tank: tank, json: json }
      if(tank.changed.length) { console.log(`tank code ${name}: ${tank.changed.join(', ')}`) }
    } catch(e) {
      console.log(`tank code ${name} could not load: ${e.message}`)
    }
  }
  return out
}

const load = function(input) {
  const source = typeof input === 'string' ? decode(input) : input
  if(!source || !Array.isArray(source.render)) { throw new Error('That is not a tank code.') }
  const report = {}
  const note = function(what) { report[what] = (report[what] || 0) + 1 }
  let nodes = 0, firing = 0
  const looks = [], lookKeys = {}

  const look = function(code) {
    if(!code || typeof code !== 'object' || !Array.isArray(code.render)) { return -1 }
    const key = JSON.stringify(code.render)
    if(key in lookKeys) { return lookKeys[key] }
    if(looks.length >= LIMITS.looks) {
      note('custom bullet looks past ' + LIMITS.looks)
      return -1
    }
    const tree = arrange(list(code.render, 1, true))
    lookKeys[key] = looks.length
    looks.push(tree)
    return looks.length - 1
  }

  const list = function(items, depth, insideLook) {
    const out = []
    if(!Array.isArray(items)) { return out }
    for(const item of items) {
      const node = convert(item, depth, insideLook)
      if(node) { out.push(node) }
    }
    return out
  }

  const convert = function(n, depth, insideLook) {
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
      const r = n.rotationData || {}
      const behavior = BEHAVIORS.indexOf(r.behavior) >= 0 ? r.behavior : 'fixed'
      const s = {
        t: 'section',
        x: round(num(n.x, -100, 100, 0)),
        y: round(num(n.y, -100, 100, 0)),
        d: round(num(n.d, -100, 100, 0)),
        size: round(num(n.size, 0, 100, 1)),
        turn: behavior === 'manual' ? 'fixed' : behavior,
        relative: r.relative === 'none' ? 'none' : 'parent',
        layer: num(n.layer, -1000, 1000, 0) | 0,
        renderLayer: num(n.renderLayer, -1000, 1000, 0) | 0,
        children: []
      }
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
      const p = n.polygonData || {}
      const shape = {
        t: 'polygon',
        sides: num(p.sides, -20, 40, 0) | 0,
        size: round(num(p.size, 0, 200, 1)),
        x: round(num(p.x, -100, 100, 0)),
        y: round(num(p.y, -100, 100, 0)),
        d: round(num(p.d, -100, 100, 0)),
        color: color(n.color, 'inherit'),
        stroke: num(n.stroke, 0, 100, 30),
        strokeAlpha: num(n.strokeAlpha, 0, 1, 1),
        lineWidth: n.fixedLineWidth === undefined ? -1 : num(n.fixedLineWidth, 0, 50, 0),
        body: n.occlude === 'scenexeBaseBase',
        radiant: num(n.overrideRadiant, 0, 10, -1),
        layer: num(n.layer, -1000, 1000, 0) | 0,
        renderLayer: num(n.renderLayer, -1000, 1000, 0) | 0
      }
      if(shape.sides < 0) { shape.inner = round(num(p.inner, 0, 1, 0.5)) }
      if(p.reverseJoints) { shape.hole = true }
      if(n.gradient && Array.isArray(n.gradient.colors)) {
        shape.gradient = n.gradient.colors.slice(0, 8).map(g => [round(num(g && g.value, 0, 1, 0)), color(g && g.color, 0)])
      }
      return shape
    }
    if(n.type === 'path') {
      const points = []
      for(const j of Array.isArray(n.joints) ? n.joints.slice(0, LIMITS.joints) : []) {
        if(!j || (j.type !== 'moveTo' && j.type !== 'lineTo')) { continue }
        points.push([round(num(j.x, -100, 100, 0)), round(num(j.y, -100, 100, 0)), j.type === 'moveTo' ? 1 : 0])
      }
      if(Array.isArray(n.joints) && n.joints.length > LIMITS.joints) { note('path points past ' + LIMITS.joints) }
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
        lineWidth: n.fixedLineWidth === undefined ? -1 : num(n.fixedLineWidth, 0, 50, 0),
        radiant: num(n.overrideRadiant, 0, 10, -1),
        first: !!n.reverseOrder
      }
    }
    if(n.type === 'barrel') {
      const d = n.data || {}
      let kind = KINDS[n.btype]
      if(!kind) {
        note('unknown barrel kinds')
        kind = 'bullet'
      }
      const b = {
        t: 'barrel',
        kind: kind,
        x: round(num(n.x, -100, 100, 0)),
        y: round(num(n.y, -100, 100, 0)),
        d: round(num(n.d, -100, 100, 0)),
        w: round(num(n.w, 0, 100, 0.5)),
        h: round(num(n.h, 0, 100, 1)),
        color: color(n.color, 'inherit'),
        lineWidth: n.fixedLineWidth === undefined ? -1 : num(n.fixedLineWidth, 0, 50, 0),
        visual: !!d.visualOnly || insideLook,
        reload: round(num(d.reload, 0.05, 600, 1)),
        offset: round(num(d.offset, 0, 1, 0)),
        recoil: round(num(d.recoil, 0, 20, 0)),
        speed: round(num(d.bulletSpeed, 0, 100, 5)),
        damage: round(num(d.bulletDamage, 0, 10000, 1)),
        health: round(num(d.bulletHealth, 0, 100000, 1)),
        time: round(num(d.bulletTime, 0.05, 120, 2)),
        size: round(num(d.bulletSize, 0.05, 20, 1)),
        density: round(num(d.bulletDensity, 0, 100, 1)),
        spray: round(num(d.bulletSpray, 0, Math.PI, 0)),
        variance: round(num(d.bulletSpeedVariance, 0, 1, 0)),
        bulletColor: d.bulletColor === 'inherit-top' ? 'inherit-top' : d.bulletColor === 'inherit' || d.bulletColor === undefined ? 'inherit' : color(d.bulletColor, 'inherit'),
        wall: !!d.wall,
        look: -1
      }
      if(kind === 'drone') { b.maxDrones = num(n.maxDrones !== undefined ? n.maxDrones : d.maxDrones, 1, LIMITS.dronesPerBarrel, 1) | 0 }
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
      return {
        t: 'aura',
        x: round(num(n.x, -100, 100, 0)),
        y: round(num(n.y, -100, 100, 0)),
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
    }
    if(n.type !== undefined) { note(`unknown parts (${text(n.type, 20)})`) }
    return null
  }

  const render = arrange(list(source.render, 0, false))
  const numbers = number(render)
  const data = source.data || {}
  return {
    name: text(source.name, 50),
    stats: {
      maxHealth: num(data.maxHealth, 1, 1e7, 100),
      bodyDamage: num(data.bodyDamage, 0, 1e5, 1),
      movementSpeed: num(data.movementSpeed, 0, 1000, 1),
      cameraSize: num(data.cameraSize, 0.1, 100, 1)
    },
    color: color(data.color, 0x383838),
    radiantBase: {
      size: num(source.radiantBase && source.radiantBase.size, 0, 100, 1),
      sides: num(source.radiantBase && source.radiantBase.sides, -20, 40, 0) | 0
    },
    render: render,
    looks: looks,
    reach: round(reach(render, 1)),
    shots: numbers.shots,
    counts: { parts: nodes, firing: firing, synced: numbers.syncs, looks: looks.length },
    changed: Object.keys(report).map(k => report[k] > 1 ? `${k} (${report[k]})` : k)
  }
}

module.exports = { decode, load, folder, forClient, LIMITS }
