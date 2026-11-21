const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { spawnSync } = require('child_process')

const SOURCE = path.join(__dirname, 'src')
const OUTPUT = path.join(__dirname, 'build')
const PREFIX = `scenexe-${process.platform}-${process.arch}`

const sources = function() {
  return fs.readdirSync(SOURCE).filter(f => f.endsWith('.c') || f.endsWith('.h')).sort()
}

const locate = function() {
  const hash = crypto.createHash('sha256')
  hash.update(`${process.platform} ${process.arch}\n`)
  for(const file of sources()) {
    hash.update(file + '\n')
    hash.update(fs.readFileSync(path.join(SOURCE, file)))
  }
  const name = `${PREFIX}-${hash.digest('hex').slice(0, 12)}.node`
  return { name, file: path.join(OUTPUT, name) }
}

const ready = function() {
  const target = locate()
  return fs.existsSync(target.file) ? target.file : null
}

const run = function(command, args, options) {
  const result = spawnSync(command, args, Object.assign({ encoding: 'utf8', windowsHide: true }, options || {}))
  return { ok: result.status === 0, output: ((result.stdout || '') + (result.stderr || '')).trim() }
}

const findMsvc = function() {
  const installer = path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Microsoft Visual Studio', 'Installer', 'vswhere.exe')
  if(!fs.existsSync(installer)) { return null }
  const found = run(installer, ['-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64', '-property', 'installationPath'])
  const vcvars = found.ok && found.output ? path.join(found.output.split(/\r?\n/)[0], 'VC', 'Auxiliary', 'Build', 'vcvars64.bat') : ''
  return vcvars && fs.existsSync(vcvars) ? vcvars : null
}

const findCc = function() {
  for(const name of [process.env.CC, 'cc', 'gcc', 'clang'].filter(Boolean)) {
    if(run(name, ['--version']).ok) { return name }
  }
  return null
}

const buildMsvc = function(work) {
  const vcvars = findMsvc()
  if(!vcvars) { return { ok: false, output: 'no C compiler found (install Visual Studio Build Tools with the C++ workload)' } }
  const header = fs.readFileSync(path.join(SOURCE, 'napi.h'), 'utf8')
  const imports = [...header.matchAll(/NAPI_IMPORT\s+napi_status\s+(\w+)\(/g)].map(m => m[1])
  fs.writeFileSync(path.join(work, 'node.def'), 'LIBRARY node.exe\r\nEXPORTS\r\n' + imports.map(f => '  ' + f).join('\r\n') + '\r\n')
  const files = sources().filter(f => f.endsWith('.c')).map(f => `"${path.join(SOURCE, f)}"`).join(' ')
  const script = [
    '@echo off',
    `call "${vcvars}" >nul`,
    'if errorlevel 1 exit /b 1',
    `cd /d "${work}"`,
    'lib /nologo /def:node.def /machine:x64 /out:node.lib',
    'if errorlevel 1 exit /b 1',
    `cl /nologo /O2 /W3 /LD /Fe:scenexe.node ${files} node.lib /link /NOLOGO`,
    'if errorlevel 1 exit /b 1'
  ].join('\r\n') + '\r\n'
  fs.writeFileSync(path.join(work, 'build.bat'), script)
  const result = run('cmd.exe', ['/d', '/c', path.join(work, 'build.bat')], { cwd: work })
  return { ok: result.ok, output: result.output, compiler: 'MSVC' }
}

const buildCc = function(work) {
  const cc = findCc()
  if(!cc) {
    const hint = process.platform === 'linux' ? ' (on Debian or Ubuntu run: sudo apt install gcc)' : ''
    return { ok: false, output: 'no C compiler found' + hint }
  }
  const files = sources().filter(f => f.endsWith('.c')).map(f => path.join(SOURCE, f))
  const link = process.platform === 'darwin' ? ['-bundle', '-undefined', 'dynamic_lookup'] : ['-shared']
  const args = ['-O2', '-std=c99', '-fPIC', '-fvisibility=hidden', '-ffp-contract=off'].concat(link, ['-o', path.join(work, 'scenexe.node')], files, ['-lm'])
  const result = run(cc, args, { cwd: work })
  return { ok: result.ok, output: result.output, compiler: cc }
}

const build = function(options) {
  options = options || {}
  const say = function(text) { if(!options.quiet) { console.log('native: ' + text) } }
  let target
  try { target = locate() } catch(e) {
    say('could not read the C sources, using JavaScript instead')
    return null
  }
  if(!options.force && fs.existsSync(target.file)) {
    say(`C modules ready (${target.name})`)
    return target.file
  }
  const started = Date.now()
  const work = path.join(OUTPUT, `work-${process.pid}`)
  const temp = path.join(OUTPUT, `tmp-${process.pid}.node`)
  try {
    fs.mkdirSync(work, { recursive: true })
    const result = process.platform === 'win32' ? buildMsvc(work) : buildCc(work)
    if(!result.ok) {
      say('C build failed, using JavaScript instead: ' + result.output.split(/\r?\n/).filter(l => /error|not found|no C compiler/i.test(l)).slice(0, 6).join(' | ').slice(0, 600))
      return null
    }
    fs.copyFileSync(path.join(work, 'scenexe.node'), temp)
    fs.renameSync(temp, target.file)
    for(const file of fs.readdirSync(OUTPUT)) {
      if(file.startsWith(PREFIX) && file !== target.name) { try { fs.rmSync(path.join(OUTPUT, file)) } catch(e) {} }
    }
    say(`built ${target.name} with ${result.compiler} in ${((Date.now() - started) / 1000).toFixed(1)}s`)
    return target.file
  } catch(e) {
    say('C build failed, using JavaScript instead: ' + e.message)
    return null
  } finally {
    try { fs.rmSync(work, { recursive: true, force: true }) } catch(e) {}
    try { fs.rmSync(temp, { force: true }) } catch(e) {}
  }
}

module.exports = { build, ready }

if(require.main === module) {
  process.exit(build({ force: process.argv.includes('--force') }) ? 0 : 1)
}
