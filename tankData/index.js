const fs = require('fs')
const path = require('path')

const FOLDERS = ['upgrades', 'weapons', 'bodies']

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
  return s + 'window.tankData = { weapons, bodies, weaponUpgradeMap, bodyUpgradeMap }\n'
}

const load = function(root) {
  const window = {}
  new Function('window', source(root))(window)
  return window.tankData
}

module.exports = { source, load }
