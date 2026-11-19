const { isMainThread } = require('worker_threads')
const builder = require('./build.js')

const load = function() {
  if(process.env.NATIVE === '0') { return null }
  let state
  try { state = builder.status() } catch(e) { return null }
  if(!state.built && isMainThread) {
    builder.build({ quiet: true })
    try { state = builder.status() } catch(e) { return null }
  }
  if(!state.built) { return null }
  try {
    const loaded = require(builder.TARGET)
    return loaded && loaded.version === state.version ? loaded : null
  } catch(e) {
    return null
  }
}

module.exports = load()
