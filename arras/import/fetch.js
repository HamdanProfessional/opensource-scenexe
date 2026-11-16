const fs = require('fs')
const path = require('path')
const https = require('https')

const CACHE_ROOT = path.join(__dirname, '.cache')

const SOURCES = {
  'broken-arras': {
    repo: 'HamdanProfessional/broken-arras',
    sha: '69a95b1aa00a24c449cb9116f04c47d3448b2867',
    tankFiles: ['groups/tanks.js', 'groups/tanks_special.js']
  },
  'open-source-arras': {
    repo: 'open-source-arras/open-source-arras',
    sha: '0339abd686acf550a1298db65bd16d4f80e94afa',
    tankFiles: ['groups/tanks/main.js']
  }
}
const DEFAULT_SOURCE = 'broken-arras'

const loadOrderFor = function(source) {
  return ['groups/generics.js', 'groups/hats.js', 'groups/projectiles.js'].concat(SOURCES[source].tankFiles, ['groups/turrets.js'])
}

const filesFor = function(source) {
  const definitions = ['gunvals.js', 'constants.js', 'facilitators.js', 'presets.js'].concat(loadOrderFor(source))
  return definitions.map(function(f) { return 'server/lib/definitions/' + f }).concat(['LICENSE'])
}

const download = function(requestPath) {
  return new Promise(function(resolve, reject) {
    https.get({ hostname: 'raw.githubusercontent.com', path: requestPath, headers: { 'User-Agent': 'arras-importer' } }, function(res) {
      if(res.statusCode !== 200) {
        res.resume()
        reject(new Error(requestPath + ' -> HTTP ' + res.statusCode))
        return
      }
      const chunks = []
      res.on('data', function(c) { chunks.push(c) })
      res.on('end', function() { resolve(Buffer.concat(chunks)) })
    }).on('error', reject)
  })
}

const cacheDirFor = function(sha) {
  return path.join(CACHE_ROOT, sha)
}

const fetchAll = async function(source, sha) {
  const dir = cacheDirFor(sha)
  for(const rel of filesFor(source)) {
    const target = path.join(dir, rel)
    if(fs.existsSync(target)) { continue }
    const body = await download('/' + SOURCES[source].repo + '/' + sha + '/' + rel)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, body)
  }
  return dir
}

module.exports = { SOURCES, DEFAULT_SOURCE, loadOrderFor, filesFor, cacheDirFor, fetchAll }
