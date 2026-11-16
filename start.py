import os
import platform
import shutil
import stat
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
import zipfile

NODE_VERSION = 'v22.11.0'
ROOT = os.path.dirname(os.path.abspath(__file__))
RUNTIME_DIR = os.path.join(ROOT, 'runtime')
DIST_BASE = f'https://nodejs.org/dist/{NODE_VERSION}'


def log(message):
    print(f'[launcher] {message}', flush=True)


def arch_id():
    machine = platform.machine().lower()
    if machine in ('arm64', 'aarch64'):
        return 'arm64'
    if machine in ('x86_64', 'amd64'):
        return 'x64'
    raise RuntimeError(f'Unsupported CPU architecture: {machine}')


def dist_name():
    system = platform.system()
    if system == 'Windows':
        return f'node-{NODE_VERSION}-win-{arch_id()}.zip'
    if system == 'Linux':
        return f'node-{NODE_VERSION}-linux-{arch_id()}.tar.xz'
    if system == 'Darwin':
        return f'node-{NODE_VERSION}-darwin-{arch_id()}.tar.gz'
    raise RuntimeError(f'Unsupported operating system: {system}')


def runtime_root():
    name = dist_name()
    stem = name[:-4] if name.endswith('.zip') else name[:-7]
    return os.path.join(RUNTIME_DIR, stem)


def runtime_node_bin():
    root = runtime_root()
    if platform.system() == 'Windows':
        return os.path.join(root, 'node.exe')
    return os.path.join(root, 'bin', 'node')


def locate_runtime():
    candidate = runtime_node_bin()
    if os.path.isfile(candidate):
        return candidate
    return None


def install_runtime():
    name = dist_name()
    url = f'{DIST_BASE}/{name}'
    archive = os.path.join(tempfile.gettempdir(), name)
    if not os.path.isfile(archive):
        log(f'downloading Node.js {NODE_VERSION} ({name})')
        urllib.request.urlretrieve(url, archive)
    log(f'extracting Node.js to {RUNTIME_DIR}')
    os.makedirs(RUNTIME_DIR, exist_ok=True)
    if name.endswith('.zip'):
        with zipfile.ZipFile(archive) as z:
            z.extractall(RUNTIME_DIR)
    else:
        with tarfile.open(archive) as t:
            try:
                t.extractall(RUNTIME_DIR, filter='data')
            except TypeError:
                t.extractall(RUNTIME_DIR)
    bin_path = runtime_node_bin()
    if not os.path.isfile(bin_path):
        raise RuntimeError(f'Node.js runtime extraction failed: {bin_path} not found')
    if platform.system() != 'Windows':
        mode = os.stat(bin_path).st_mode
        os.chmod(bin_path, mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return bin_path


def ensure_node():
    system_node = shutil.which('node')
    if system_node:
        version = subprocess.run([system_node, '--version'], capture_output=True, text=True).stdout.strip()
        log(f'using system Node.js {version}')
        return system_node
    local = locate_runtime()
    if local:
        log(f'using bundled Node.js {NODE_VERSION}')
        return local
    bin_path = install_runtime()
    log(f'using bundled Node.js {NODE_VERSION}')
    return bin_path


def npm_cli_js(node_bin):
    real_bin = os.path.realpath(node_bin)
    bin_dir = os.path.dirname(real_bin)
    prefix = os.path.dirname(bin_dir)
    candidates = [
        os.path.join(bin_dir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        os.path.join(prefix, 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        os.path.join(prefix, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        '/usr/lib/node_modules/npm/bin/npm-cli.js',
        '/usr/local/lib/node_modules/npm/bin/npm-cli.js',
        '/usr/share/nodejs/npm/bin/npm-cli.js',
    ]
    for candidate in candidates:
        if os.path.isfile(candidate):
            return candidate
    return None


def deps_present():
    for dep in ('ws', 'msgpackr'):
        if not os.path.isdir(os.path.join(ROOT, 'node_modules', dep)):
            return False
    return True


def ensure_deps(node_bin):
    if deps_present():
        log('dependencies already installed')
        return
    cli = npm_cli_js(node_bin)
    if cli:
        cmd = [node_bin, cli]
    else:
        system_npm = shutil.which('npm')
        if not system_npm:
            raise RuntimeError('npm CLI not found in the Node.js runtime')
        cmd = [system_npm]
    log('installing dependencies')
    subprocess.run(cmd + ['install', '--no-audit', '--no-fund'], cwd=ROOT, check=True)
    if not deps_present():
        raise RuntimeError('dependency installation failed')


def main():
    node_bin = ensure_node()
    ensure_deps(node_bin)
    log('starting server')
    try:
        return subprocess.call([node_bin, 'server.js'], cwd=ROOT)
    except KeyboardInterrupt:
        return 0


if __name__ == '__main__':
    sys.exit(main())
