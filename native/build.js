const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { spawnSync } = require('child_process')

const SOURCE = path.join(__dirname, 'src')
const OUTPUT = path.join(__dirname, 'build')
const NAME = `scenexe-${process.platform}-${process.arch}.node`
const TARGET = path.join(OUTPUT, NAME)

const sources = function() {
  return fs.readdirSync(SOURCE).filter(f => f.endsWith('.c') || f.endsWith('.h')).sort()
}

const fingerprint = function() {
  const hash = crypto.createHash('sha256')
  hash.update(`${process.platform} ${process.arch}\n`)
  for(const file of sources()) {
    hash.update(file + '\n')
    hash.update(fs.readFileSync(path.join(SOURCE, file)))
  }
  return parseInt(hash.digest('hex').slice(0, 7), 16)
}

const run = function(command, args, options) {
  const result = spawnSync(command, args, Object.assign({ encoding: 'utf8', windowsHide: true }, options || {}))
  return { ok: result.status === 0, output: ((result.stdout || '') + (result.stderr || '')).trim(), missing: !!result.error }
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

const buildMsvc = function(work, version) {
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
    `cl /nologo /O2 /fp:precise /W3 /LD /DSCENEXE_VERSION=${version} /D_CRT_SECURE_NO_WARNINGS /Fe:scenexe.node ${files} node.lib /link /NOLOGO`,
    'if errorlevel 1 exit /b 1'
  ].join('\r\n') + '\r\n'
  fs.writeFileSync(path.join(work, 'build.bat'), script)
  const result = run('cmd.exe', ['/d', '/c', path.join(work, 'build.bat')], { cwd: work })
  return { ok: result.ok, output: result.output, compiler: 'MSVC' }
}

const buildCc = function(work, version) {
  const cc = findCc()
  if(!cc) {
    const hint = process.platform === 'linux' ? ' (on Debian or Ubuntu run: sudo apt install gcc)' : ''
    return { ok: false, output: 'no C compiler found' + hint }
  }
  const files = sources().filter(f => f.endsWith('.c')).map(f => path.join(SOURCE, f))
  const link = process.platform === 'darwin' ? ['-bundle', '-undefined', 'dynamic_lookup'] : ['-shared']
  const args = ['-O2', '-std=c99', '-fPIC', '-fvisibility=hidden', '-ffp-contract=off', `-DSCENEXE_VERSION=${version}`].concat(link, ['-o', path.join(work, 'scenexe.node')], files, ['-lm'])
  const result = run(cc, args, { cwd: work })
  return { ok: result.ok, output: result.output, compiler: cc }
}

const status = function() {
  const version = fingerprint()
  if(!fs.existsSync(TARGET)) { return { version, built: false } }
  const stamp = fs.existsSync(TARGET + '.version') ? fs.readFileSync(TARGET + '.version', 'utf8').trim() : ''
  return { version, built: stamp === String(version) }
}

const build = function(options) {
  options = options || {}
  const quiet = !!options.quiet
  const say = function(text) { if(!quiet) { console.log('native: ' + text) } }
  let current
  try { current = status() } catch(e) {
    say('could not read the C sources, using JavaScript instead')
    return false
  }
  if(current.built && !options.force) {
    say(`C modules ready (${NAME})`)
    return true
  }
  const started = Date.now()
  const work = path.join(OUTPUT, `work-${process.pid}`)
  try {
    fs.mkdirSync(work, { recursive: true })
    const result = process.platform === 'win32' ? buildMsvc(work, current.version) : buildCc(work, current.version)
    if(!result.ok) {
      say('C build failed, using JavaScript instead: ' + result.output.split(/\r?\n/).filter(l => /error|not found|no C compiler/i.test(l)).slice(0, 6).join(' | ').slice(0, 600))
      return false
    }
    const temp = TARGET + `.${process.pid}.tmp`
    fs.copyFileSync(path.join(work, 'scenexe.node'), temp)
    try { fs.renameSync(temp, TARGET) } catch(e) {
      try {
        fs.renameSync(TARGET, TARGET + `.old-${Date.now()}`)
        fs.renameSync(temp, TARGET)
      } catch(e2) {
        fs.rmSync(temp, { force: true })
        say('could not replace the old C module, using JavaScript instead')
        return false
      }
    }
    for(const file of fs.readdirSync(OUTPUT)) {
      if(file.startsWith(NAME + '.old-')) { try { fs.rmSync(path.join(OUTPUT, file)) } catch(e) {} }
    }
    fs.writeFileSync(TARGET + '.version', String(current.version))
    say(`built ${NAME} with ${result.compiler} in ${((Date.now() - started) / 1000).toFixed(1)}s`)
    return true
  } catch(e) {
    say('C build failed, using JavaScript instead: ' + e.message)
    return false
  } finally {
    try { fs.rmSync(work, { recursive: true, force: true }) } catch(e) {}
  }
}

module.exports = { build, status, fingerprint, TARGET }

if(require.main === module) {
  process.exit(build({ force: process.argv.includes('--force') }) ? 0 : 1)
}
