    !function() {
      const button = document.createElement('button')
      button.id = 'serversButton'
      button.textContent = 'Servers'
      playMenu.appendChild(button)

      const root = document.createElement('div')
      root.id = 'serverBrowser'
      root.innerHTML = `<div id="sbTitle">Servers</div>` +
        `<div id="sbList"></div>` +
        `<div id="sbCustom"><input id="sbAddress" type="text" maxlength="110" placeholder="Server address, like 1.2.3.4:22440" spellcheck="false"><button class="csBtn" data-act="join">JOIN</button></div>` +
        `<div id="sbNote"></div>` +
        `<div id="sbButtons"><button class="csBtn" data-act="refresh">REFRESH</button><button class="csBtn" data-act="close">CLOSE</button></div>`
      document.body.appendChild(root)
      const list = root.querySelector('#sbList')
      const address = root.querySelector('#sbAddress')
      const note = root.querySelector('#sbNote')
      const here = location.host.toLowerCase()

      const validAddress = function(a) {
        return /^[a-z0-9.-]{1,100}(:\d{1,5})?$/i.test(a)
      }
      const go = function(a) {
        a = String(a || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase()
        if(!validAddress(a)) {
          note.textContent = 'That does not look like a server address.'
          return
        }
        if(a === here) {
          show(false)
          return
        }
        location.href = `http://${a}/`
      }

      const row = function(server) {
        const el = document.createElement('div')
        el.className = 'sbRow' + (server.address === here ? ' current' : '')
        const name = document.createElement('div')
        name.className = 'sbName'
        name.textContent = server.name + (server.official ? ' (official)' : '')
        const info = document.createElement('div')
        info.className = 'sbInfo'
        info.textContent = `${server.address}  -  ${server.players} ${server.players === 1 ? 'player' : 'players'}`
        const join = document.createElement('button')
        join.className = 'csBtn'
        join.textContent = server.address === here ? 'HERE' : 'JOIN'
        join.addEventListener('click', function() { go(server.address) })
        const text = document.createElement('div')
        text.appendChild(name)
        text.appendChild(info)
        el.appendChild(text)
        el.appendChild(join)
        return el
      }

      const load = function() {
        list.textContent = ''
        note.textContent = 'Loading servers...'
        fetch('/servers', { cache: 'no-store' }).then(function(r) { return r.json() }).then(function(servers) {
          list.textContent = ''
          if(!Array.isArray(servers) || !servers.length) {
            note.textContent = 'No servers are listed right now.'
            return
          }
          for(const server of servers) { list.appendChild(row(server)) }
          note.textContent = 'Want your own server on this list? See the hosting guide on GitHub.'
        }).catch(function() {
          note.textContent = 'Could not load the server list.'
        })
      }

      let open = false
      const show = function(v) {
        open = v
        root.classList.toggle('open', v)
        if(v) { load() }
      }
      button.addEventListener('click', function(e) {
        if(!e.isTrusted) { return }
        show(true)
        button.blur()
      })
      root.addEventListener('click', function(e) {
        const b = e.target.closest('[data-act]')
        if(!b) { return }
        if(b.dataset.act === 'join') { go(address.value) }
        else if(b.dataset.act === 'refresh') { load() }
        else if(b.dataset.act === 'close') { show(false) }
        b.blur()
      })
      address.addEventListener('keydown', function(e) {
        e.stopPropagation()
        if(e.keyCode === 13) { go(address.value) }
        else if(e.keyCode === 27) { show(false) }
      })
      for(const ev of ['mousedown', 'mouseup', 'wheel', 'touchstart', 'contextmenu']) {
        root.addEventListener(ev, function(e) { e.stopPropagation() })
      }
      window.addEventListener('keydown', function(e) {
        if(open && e.keyCode === 27) { show(false) }
      }, true)
    }()
