  let customServer = false, customServerUrl = '', waitingForServer = false, tankData
  let pageUrl = new URL(location.href)
  let urlParams = pageUrl.searchParams
  if(urlParams.get('g')) {
    urlParams.delete('g')
  }
  history.pushState('', '', pageUrl.href)
  let isLocal = false, localSocket = function() {}, data = {}
  let gameCurrentServer = {
    address: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${new URL(location.href).host}`,
    ws: false,
    u: false,
  }
  try {
    if(urlParams.get('l')) {
      isLocal = true
      customServer = true
    } else if(urlParams.get('s')) {
      let u = new URL(`${location.protocol === 'https:' ? 'wss' : 'ws'}://` + urlParams.get('s'))
      customServerUrl = u.host
      gameCurrentServer.address = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${customServerUrl}`
      customServer = true
    }
  } catch(e) {}
  !function() {
    let elementIds = ['mapInfo', 'coords', 'modals', 'disconnectText', 'disconnectReload', 'disconnectDark', 'disconnect', 'serverSelectLowerText', 'serverSelectLeftOuter', 'serverSelectRightOuter', 'serverSelectRight', 'serverSelectLeft', 'serverSelectSlide', 'respawnCanvas', 'title', 'contactContent', 'contactDark', 'contactSubmit', 'contactCancel', 'tipsBack', 'tipsDark', 'changelogContent', 'changelogBack', 'changelogDark', 'changelogFull', 'changelog', 'serverSelectLower', 'debugSlide', 'debugText', 'joystickRightInner', 'joystickRight', 'joystickLeftInner', 'joystickLeft', 'killer', 'respawnText', 'respawnContinue', 'panel', 'respawnPanel', 'tankName', 'tankLevel', 'tankScoreDisplay', 'tankLevelDisplay', 'tankScoreBar', 'tankLevelBar', 'chat', 'gameCanvas', 'hudCanvas', 'mapCanvas', 'overlay1', 'overlay2', 'playMenu', 'connectingSmall', 'connecting', 'playButton', 'statDisplayLeft', 'statDisplayRight', 'leaderboard', 'leaderboardEntries']
    for(let i=elementIds.length-1;i>=0;i--) {
      window[elementIds[i]] = document.getElementById(elementIds[i])
    }
    let username = document.getElementById('name'), admin = false
    const darknessCanvas = document.createElement('canvas')
    const pack = function(value) {
      return msgpack.encode(value)
    }
    const unpack = function(bytes) {
      return msgpack.decode(bytes)
    }
    const defaultTankData = JSON_tankData;
    defaultTankData.weaponUpgradeMap['@@override'] = {
      level: 0,
      upgrades: []
    }
    defaultTankData.bodyUpgradeMap['@@override'] = {
      level: 0,
      upgrades: []
    }
