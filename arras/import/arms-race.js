const fs = require('fs')
const path = require('path')
const { SOURCES, DEFAULT_SOURCE, loadOrderFor, cacheDirFor, fetchAll } = require('./fetch.js')
const { loadOsa } = require('./sandbox.js')
const { makeConverter } = require('./convert.js')

const ROOT = path.join(__dirname, '..', '..')
const TANK_DATA = path.join(ROOT, 'tankData')
const ADDON = 'groups/armsRaceTanks.js'
const ADDON_FILE = 'server/lib/definitions/entityAddons/armsRace/tanks.js'
const LEVEL_PER_TIER = 10

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

const run = async function() {
  const offline = process.argv.includes('--offline')
  const source = DEFAULT_SOURCE
  const sha = SOURCES[source].sha
  const cacheDir = offline ? cacheDirFor(sha) : await fetchAll(source, sha, [ADDON_FILE])
  const defs = path.join(cacheDir, 'server', 'lib', 'definitions')
  const addonText = fs.readFileSync(path.join(cacheDir, ADDON_FILE), 'utf8').split('\n').filter(function(line) { return !/menu_unused/.test(line) }).join('\n')
  fs.writeFileSync(path.join(defs, ADDON), addonText)
  const osa = loadOsa(cacheDir, loadOrderFor(source).concat([ADDON]), { arms_race: true, level_cap: 120, level_cap_cheat: 120 })
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

  console.log('loader failures: ' + JSON.stringify(osa.failures))
  console.log('reachable: ' + reachable.length + ', new tanks: ' + Object.keys(weapons).length + ', upgrade entries: ' + Object.keys(merged).length + ', new upgrade links: ' + added)
  console.log('dropped unfinished: ' + dropped.length + ', unreachable after drop: ' + (Object.keys(candidates).length - Object.keys(weapons).length - dropped.length))
  console.log('dropped: ' + dropped.map(function(k) { return k.slice('arras:'.length) }).join(' '))
  for(const bucket of Object.keys(report)) {
    console.log(bucket + ': ' + JSON.stringify(report[bucket]).slice(0, 600))
  }
}

run().catch(function(err) {
  console.error(err)
  process.exit(1)
})
