const fs = require('fs')
const path = require('path')
const tankCode = require('../shared/tank-code.js')

const FOLDERS = ['upgrades', 'weapons', 'bodies']

const clamp = function(value, low, high) {
  return Math.max(low, Math.min(high, value))
}

const codeBodies = function(root) {
  const dir = path.join(root, 'codes')
  if(!fs.existsSync(dir)) { return '' }
  const codes = tankCode.folder(dir)
  const bodies = {}, weapons = {}
  for(const name in codes) {
    const tank = codes[name].tank, stats = tank.stats, units = tankCode.STATS
    bodies['code:' + name] = {
      name: tank.name || name,
      movementSpeed: clamp(stats.movementSpeed / units.movementSpeed.unit, 0.25, 2),
      maxHealth: clamp(stats.maxHealth / units.maxHealth.unit, 0.5, 20),
      bodyDamage: clamp(stats.bodyDamage / units.bodyDamage.unit, 0.25, 5),
      cameraSizeMultiplier: clamp(stats.cameraSize / units.cameraSize.unit, 0.5, 3),
      sides: 0,
      color: { r: (tank.color >> 16) & 255, g: (tank.color >> 8) & 255, b: tank.color & 255 },
      turrets: [],
      auras: [],
      code: name
    }
    weapons['code:' + name] = { name: tank.name || name, cameraSizeMultiplier: 1, barrels: [], weaponTurrets: [] }
  }
  return '_(bodies, ' + JSON.stringify(bodies) + ')\n_(weapons, ' + JSON.stringify(weapons) + ')\n'
}

const source = function(root) {
  root = root || __dirname
  let s = 'const _ = function(o, p) { for(let k in p) { o[k] = p[k] } }\n' +
    'let weaponUpgradeMap = {}, bodyUpgradeMap = {}, weapons = {}, bodies = {}\n'
  for(const folder of FOLDERS) {
    const dir = path.join(root, folder)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_')).sort()
    for(const f of files) {
      s += `// ---- ${folder}/${f}\n` + fs.readFileSync(path.join(dir, f)).toString() + '\n'
    }
  }
  s += codeBodies(root)
  return s + 'window.tankData = { weapons, bodies, weaponUpgradeMap, bodyUpgradeMap }\n'
}

const load = function(root) {
  const window = {}
  new Function('window', source(root))(window)
  return window.tankData
}

module.exports = { source, load }
