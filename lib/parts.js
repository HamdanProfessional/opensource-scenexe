const fs = require('fs')
const path = require('path')
const Module = require('module')

const list = function(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()
}

const read = function(dir) {
  const files = list(dir)
  return { files, texts: files.map(f => fs.readFileSync(path.join(dir, f)).toString()) }
}

const join = function(dir) {
  return read(dir).texts.join('')
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const vlq = function(n) {
  let v = n < 0 ? ((-n) << 1) | 1 : n << 1, s = ''
  do {
    let d = v & 31
    v >>>= 5
    if(v) { d |= 32 }
    s += B64[d]
  } while(v)
  return s
}

const sourceMap = function(dir, files, texts) {
  const mappings = []
  let prevSrc = 0, prevLine = 0
  for(let si=0;si<files.length;si++) {
    const t = texts[si]
    const n = t.split('\n').length - (t.endsWith('\n') ? 1 : 0)
    for(let line=0;line<n;line++) {
      mappings.push('A' + vlq(si - prevSrc) + vlq(line - prevLine) + 'A')
      prevSrc = si
      prevLine = line
    }
  }
  return { version: 3, sources: files.map(f => path.join(dir, f)), mappings: mappings.join(';') }
}

const run = function(dir, parent, virtualName) {
  const { files, texts } = read(dir)
  const filename = path.join(path.dirname(parent.filename), virtualName)
  const map = sourceMap(dir, files, texts)
  const src = texts.join('') + '\n//# sourceMappingURL=data:application/json;base64,' + Buffer.from(JSON.stringify(map)).toString('base64')
  if(process.setSourceMapsEnabled) { process.setSourceMapsEnabled(true) }
  const m = new Module(filename, parent)
  m.filename = filename
  m.paths = Module._nodeModulePaths(path.dirname(filename))
  m._compile(src, filename)
  return m.exports
}

module.exports = { list, join, run }
