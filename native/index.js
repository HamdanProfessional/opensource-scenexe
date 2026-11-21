const { isMainThread } = require('worker_threads')
const builder = require('./build.js')

const names = ['collide', 'view', 'wake', 'pick', 'encode']

const load = function() {
  if(process.env.NATIVE === '0') { return null }
  try {
    const file = isMainThread ? builder.build({ quiet: true }) : builder.ready()
    const loaded = file ? require(file) : null
    if(!loaded) { return null }
    for(let i = 0; i < names.length; i++) {
      if(typeof loaded[names[i]] !== 'function') { return null }
    }
    return loaded
  } catch(e) {
    return null
  }
}

module.exports = load()
