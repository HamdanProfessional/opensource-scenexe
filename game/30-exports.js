module.exports = {
  run: function(options, t) {
    let tankData
    try {
      tankData = require(require('path').resolve(options.tankDataDir || './tankData', 'index.js')).load()
    } catch(e) {
      let window = {}
      eval(fs.readFileSync('./tankData.js').toString())
      tankData = window.tankData
      if(!tankData) { throw e }
    }
    secret = options.secret
    let data = main(tankData, options)
    if(t) { eval(t) }
    return data
  }
}

process.on('exit', function(code){
  return console.log(`[worker] Exiting with code ${code}`);
});
