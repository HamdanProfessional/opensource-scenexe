const fs = require('fs')
const path = require('path')
const vm = require('vm')

const DEFINITIONS = 'server/lib/definitions'

const SUPPORT_FILES = [
  'gunvals.js',
  'constants.js',
  'facilitators.js',
  'presets.js'
]

const loadOsa = function(cacheDir, loadOrder, configOverrides, strict, transforms) {
  const base = path.join(cacheDir, DEFINITIONS)
  const placeholders = new Map()
  const classTable = {}
  const failures = []

  const Class = new Proxy(classTable, {
    get(target, key) {
      if(typeof key !== 'string') { return target[key] }
      if(key in target) { return target[key] }
      if(key === 'toJSON' || key === 'then' || strict) { return undefined }
      if(!placeholders.has(key)) { placeholders.set(key, { PLACEHOLDER: true, NAME: key }) }
      return placeholders.get(key)
    }
  })

  const Config = new Proxy({
    spawn_class: 'basic',
    skill_cap: 9,
    tier_multiplier: 15,
    glass_health_factor: 2,
    level_cap: 45,
    ...configOverrides
  }, {
    get(target, key) { return target[key] }
  })

  const ensureIsClass = function(type) {
    if(typeof type === 'string') {
      if(!(type in classTable)) { throw new Error('unknown class ' + type) }
      return classTable[type]
    }
    if(type && typeof type === 'object') { return type }
    throw new Error('bad class reference')
  }

  const sandbox = {
    Class, Config, ensureIsClass,
    key: function(k) { return k },
    console: { log() {}, warn() {}, error() {} },
    Math, JSON, Object, Array, String, Number, Boolean, Symbol, Map, Set, WeakMap, Error, RangeError, TypeError, Date, RegExp, Infinity, NaN, parseInt, parseFloat, isNaN, isFinite
  }
  sandbox.global = sandbox
  sandbox.globalThis = sandbox
  const context = vm.createContext(sandbox)

  const moduleCache = {}
  const sources = {}
  for(const rel of SUPPORT_FILES.concat(loadOrder)) {
    sources[path.basename(rel)] = { rel, file: path.join(base, rel) }
  }

  const requireModule = function(request) {
    const base = path.basename(request)
    const name = path.extname(base) ? base : base + '.js'
    if(name === 'config.js') { return Config }
    if(!sources[name]) { return {} }
    return runModule(name)
  }

  const runModule = function(name) {
    if(moduleCache[name]) { return moduleCache[name].exports }
    const entry = sources[name]
    const module = { exports: {} }
    moduleCache[name] = module
    const text = fs.readFileSync(entry.file, 'utf8')
    const code = '(function(module, exports, require) {' + (transforms && transforms[name] ? transforms[name](text) : text) + '\n})'
    const fn = vm.runInContext(code, context, { filename: entry.rel })
    fn(module, module.exports, requireModule)
    return module.exports
  }

  for(const rel of loadOrder) {
    const name = path.basename(rel)
    try {
      runModule(name)
    } catch(err) {
      failures.push({ file: rel, error: String(err && err.message || err), at: String(err && err.stack || '').split('\n').slice(1, 5).join(' <- ') })
    }
  }

  const extend = function(files, globals) {
    Object.assign(context, globals || {})
    const done = []
    for(const file of files) {
      const name = 'wiki:' + path.relative(cacheDir, file).split(path.sep).join('/')
      sources[name] = { rel: name, file }
      try {
        runModule(name)
        done.push(file)
      } catch(err) {
        failures.push({ file: name, error: String(err && err.message || err), at: String(err && err.stack || '').split('\n').slice(1, 3).join(' <- ') })
      }
    }
    return done
  }

  return { Class, classTable, failures, placeholders, extend }
}

module.exports = { loadOsa }
