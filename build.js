const fs = require('fs')
const path = require('path')
const parts = require('./lib/parts.js')

const out = path.join(__dirname, 'dist')
fs.mkdirSync(out, { recursive: true })
for(const [dir, file] of [['client', 'script.js'], ['game', 'engine.js'], ['server', 'server.js']]) {
  fs.writeFileSync(path.join(out, file), parts.join(path.join(__dirname, dir)))
  console.log(`dist/${file}`)
}
fs.writeFileSync(path.join(out, 'tankData.js'), require('./tankData/index.js').source())
console.log('dist/tankData.js')
