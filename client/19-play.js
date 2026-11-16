    const trusted = function(e) {
      return e.isTrusted
    }
    const leaveDeathScreen = function() {
      respawnPanel.style.top = '-100%'
      game.dead = false
      game.spectate = false
      overlay1.classList.remove('dead')
      setTimeout(function() {
        render.lastTank = false
      }, 500)
    }
    respawnContinue.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      leaveDeathScreen()
      play()
    })
    deathMenu.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      leaveDeathScreen()
      page.setOverlay(0)
      panel.style.opacity = 1
    })
    disconnectReload.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      location.reload()
    })
    serverSelectLeftOuter.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      render.serverSelectSlide.sLeft()
      page.sweepBackground(-1)
    })
    serverSelectRightOuter.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      render.serverSelectSlide.sRight()
      page.sweepBackground(1)
    })
    playButton.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      play()
    })
    const play = function() {
      if(page.state.inGame === false && page.state.sentConnecting === false) {
        if(mobile) {
          try {
            document.documentElement.requestFullscreen()
          } catch(e) {}
        }
        panel.style.backdropFilter = 'none'
        render.reset()
        pageLeaderboard.reset()
        game.autoFire = false
        game.autoSpin = false
        game.passive = false
        render.typing = false
        panel.style.opacity = 0
        page.setOverlay(1, 'Connecting')
        checkAlt(true)
        setTimeout(function() {
          if(checkAlt() && !isLocal) {
            page.setOverlay(0)
            gameEnd('The game is already open in another tab. Close it, then reload this page.', 'rgb(255, 160, 0)')
          } else {
            let s = render.serverSelectSlide.name
            if(s) {
              admin = false
              let uv = (username.value || '').slice(0, 50)
              if(isBad(uv)) {
                gameConnect = function() {}
                gameCurrentServer.ws.close()
                disconnectText.textContent = 'Kicked from server'
                disconnectText.style.color = 'rgb(255, 0, 0)'
                page.setOverlay(0)
              }
              gameSend(gameCurrentServer.ws, ['joinGame', [uv, s, arrasMode.active ? 'arras' : '']])
            }
          }
        }, 500)
      }
    }
    username.value = localStorage.username || ''
    username.addEventListener('input', function() {
      localStorage.username = username.value
    })
    window.onerror = function(e) { alert(e) }
    window.addEventListener('resize', render.resize)
    document.addEventListener('keydown', game.keydown)
    document.addEventListener('keyup', game.keyup)
    document.addEventListener('mousemove', game.mousemove)
    document.addEventListener('mousedown', game.mousedown)
    document.addEventListener('wheel', game.wheel)
    document.addEventListener('mouseup', game.mouseup)
    window.oncontextmenu = function(e) {
      if(!e.target.allowContextMenu) {
        return false
      }
    }
    fetch('changelog').then(x => x.text()).then(x => {
      let entries = []
      let s = x.split('\n')
      let c = false
      for(let i=0,l=s.length;i<l;i++) {
        let line = s[i]
        if(line.startsWith('BETA')) {
          if(c) {
            entries.push(c)
          }
          c = {
            title: line,
            contents: []
          }
        } else if(c && line[0] === '-') {
          if(line[1] === '-') {
            c.contents.push({
              indent: 1,
              text: line.slice(2)
            })
          } else {
            c.contents.push({
              indent: 0,
              text: line.slice(1)
            })
          }
        }
      }
      if(c) {
        entries.push(c)
      }
      let latest = entries[0]
      if(!latest) { return }
      changelog.style.visibility = 'visible'
      menuVersion.textContent = latest.title.split(' - ')[0]
      let innerHTML = `<div class="clHead radiantColor">CHANGELOG - ${latest.title}</div>`
      for(let i=0,l=Math.min(5, latest.contents.length);i<l;i++) {
        let entry = latest.contents[i]
        innerHTML += `<div class="clLine${entry.indent ? ' clSub' : ''}">- ${entry.text}</div>`
      }
      changelog.innerHTML = innerHTML
      innerHTML = ''
      for(let i=0,l=entries.length;i<l;i++) {
        let latest = entries[i]
        innerHTML += `<div class="radiantColor" style="line-height:210%;font-weight:600;">${latest.title}</div>`
        for(let i=0,l=latest.contents.length;i<l;i++) {
          let entry = latest.contents[i]
          innerHTML += `<div style="line-height:140%;margin-left:${50 + entry.indent * 50}px;">- ${entry.text}</div>`
        }
        if(i < l - 1) {
          innerHTML += '<hr>'
        }
      }
      changelogContent.innerHTML = innerHTML
      let ldiv = document.createElement('div')
      ldiv.className = 'clMore'
      ldiv.textContent = 'you can view the full changelog '
      let lspan = document.createElement('span')
      lspan.className = 'link'
      lspan.textContent = 'here'
      ldiv.appendChild(lspan)
      lspan.addEventListener('click', function(e) {
        if(!trusted(e)) { return }
        page.openChangelog()
      })
      changelog.appendChild(ldiv)
    })
    changelogBack.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      changelogFull.style.top = '-100%'
      changelogDark.style.opacity = 0
      changelogDark.style.pointerEvents = 'none'
    })
    accountBack.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      accountFull.style.top = '-100%'
      accountDark.style.opacity = 0
      accountDark.style.pointerEvents = 'none'
    })
    tipsBack.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      tips.style.top = '-100%'
      tipsDark.style.opacity = 0
      tipsDark.style.pointerEvents = 'none'
    })
    window.addEventListener('beforeunload', function(e) {
      if(gameData.me) {
        e.preventDefault()
        return true
      } else {
        return null
      }
    }, true)
    contactSubmit.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      contactContent.value = ''
      contact.style.top = '-100%'
      contactDark.style.opacity = 0
      contactDark.style.pointerEvents = 'none'
    })
    contactCancel.addEventListener('click', function(e) {
      if(!trusted(e)) { return }
      contactContent.value = ''
      contact.style.top = '-100%'
      contactDark.style.opacity = 0
      contactDark.style.pointerEvents = 'none'
    })

    gameData.grid.generate()
    setInterval(gameData.grid.generate, 15000)
    render.resize()
    setTimeout(function() {
      document.body.style.visibility = "visible";
      document.body.style.opacity = 1
    }, 1000)
