import os
import platform
import shutil
import stat
import subprocess
import sys
import tarfile
import hashlib
import json
import tempfile
import urllib.request
import zipfile

NODE_VERSION = 'v22.11.0'
ROOT = os.path.dirname(os.path.abspath(__file__))
RUNTIME_DIR = os.path.join(ROOT, 'runtime')
DIST_BASE = f'https://nodejs.org/dist/{NODE_VERSION}'
REPO = 'HamdanProfessional/opensource-scenexe'
BRANCH = 'main'
VERSION_FILE = os.path.join(ROOT, '.update-version')
MANIFEST_FILE = os.path.join(ROOT, '.update-manifest')
KEEP_IF_PRESENT = {'config.json'}


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


def fetch(url, accept=None):
    headers = {'User-Agent': 'open-scenexe-launcher'}
    if accept:
        headers['Accept'] = accept
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        return response.read()


def read_text(path):
    try:
        with open(path, encoding='utf-8') as f:
            return f.read().strip()
    except OSError:
        return ''


def file_hash(path):
    try:
        with open(path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    except OSError:
        return ''


def latest_commit():
    return fetch(f'https://api.github.com/repos/{REPO}/commits/{BRANCH}', 'application/vnd.github.sha').decode().strip()


def safe_target(relative):
    target = os.path.realpath(os.path.join(ROOT, relative))
    if os.path.commonpath([target, os.path.realpath(ROOT)]) != os.path.realpath(ROOT):
        raise RuntimeError(f'unsafe path in update archive: {relative}')
    return target


def apply_update(commit):
    archive = os.path.join(tempfile.gettempdir(), f'open-scenexe-{commit}.tar.gz')
    with open(archive, 'wb') as f:
        f.write(fetch(f'https://codeload.github.com/{REPO}/tar.gz/{commit}'))
    installed = []
    with tarfile.open(archive) as t:
        for member in t.getmembers():
            if not member.isfile():
                continue
            parts = member.name.split('/', 1)
            if len(parts) < 2 or not parts[1]:
                continue
            relative = parts[1]
            installed.append(relative)
            target = safe_target(relative)
            if relative in KEEP_IF_PRESENT and os.path.exists(target):
                continue
            os.makedirs(os.path.dirname(target), exist_ok=True)
            source = t.extractfile(member)
            with open(target, 'wb') as out:
                shutil.copyfileobj(source, out)
    os.remove(archive)
    previous = read_text(MANIFEST_FILE).splitlines()
    current = set(installed)
    for relative in previous:
        if relative and relative not in current and relative not in KEEP_IF_PRESENT:
            target = safe_target(relative)
            if os.path.isfile(target):
                os.remove(target)
                log(f'removed {relative}')
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sorted(current)))
    with open(VERSION_FILE, 'w', encoding='utf-8') as f:
        f.write(commit)
    return len(installed)


def update_from_github():
    if os.path.isdir(os.path.join(ROOT, '.git')):
        log('git checkout found, skipping update (use git pull)')
        return
    try:
        commit = latest_commit()
    except Exception as error:
        log(f'update check failed, starting current version ({error})')
        return
    if commit == read_text(VERSION_FILE):
        log(f'up to date ({commit[:7]})')
        return
    log(f'updating to {commit[:7]} from github.com/{REPO}')
    try:
        count = apply_update(commit)
    except Exception as error:
        log(f'update failed, starting current version ({error})')
        return
    log(f'updated {count} files')


def ensure_deps(node_bin, force=False):
    if deps_present() and not force:
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
    lock_before = file_hash(os.path.join(ROOT, 'package-lock.json'))
    if '--no-update' not in sys.argv:
        update_from_github()
    lock_changed = file_hash(os.path.join(ROOT, 'package-lock.json')) != lock_before
    node_bin = ensure_node()
    ensure_deps(node_bin, lock_changed)
    log('starting server')
    try:
        return subprocess.call([node_bin, 'server.js'], cwd=ROOT)
    except KeyboardInterrupt:
        return 0


if __name__ == '__main__':
    sys.exit(main())
