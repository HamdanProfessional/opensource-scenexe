const server = new WebSocketServer({
  noServer: true,
  maxPayload: anticheat.settings.maxPacketBytes,
  perMessageDeflate: {
    threshold: 64,
    concurrencyLimit: 8,
    serverMaxWindowBits: 13,
    clientNoContextTakeover: true,
    zlibDeflateOptions: { level: 1, memLevel: 7 },
    zlibInflateOptions: { chunkSize: 4 * 1024 }
  }
});

httpServer.on('upgrade', (request, socket, head) => {
  if(debug) console.log('upgrade')

  let ip = getIp(request)
  if(banned[ip] === true || anticheat.isBanned(ip)) { return socket.destroy() }

  const parsed = url.parse(request.url)
  const params = Object.fromEntries(new url.URLSearchParams(parsed.query))
  if(parsed.pathname !== '/ws' || !ticket.check(params.t, params.n, ip)) {
    if(debug) console.log('rejected connection', ip)
    return socket.destroy()
  }
  server.handleUpgrade(request, socket, head, (ws) => {
    ws.joinToken = joinToken()
    ws._ip = ip
    server.emit('connection', ws);
  });
});

const joinToken = function() {
  while(true) {
    let p = '', j = 0
    for(let i=0;i<5;i++) {
      const q = Math.floor(Math.random() * 16)
      j += q
      p += '0123456789abcdef'[q]
    }
    p += '0123456789abcdef'[j % 16]
    if(!clients.some(c => c.joinToken === p)) { return p }
  }
}

const current = {
  write: function() {
    let k = current.clients
    let rowCount = 1 + Math.max(...Object.keys(k))
    let table = ''
    let padLeft = function(s, l) {
      if(s.length > l) {
        return s.slice(0, l)
      }
      s = '' + s
      let p = l - s.length
      let f = ''
      for(let i=0;i<p;i++) {
        f += ' '
      }
      return f + s
    }
    for(let i=0;i<rowCount;i++) {
      let ws = k[i]
      if(ws) {
        let [receive, receiveSize] = ws.data.receive.stats()
        let [send, sendSize] = ws.data.send.stats()
        let name = ws.data.name ? ws.data.name || '' : ''
        table += `${padLeft(receive, 4)}   ${padLeft(receiveSize, 10)}   ${padLeft(send, 4)}   ${padLeft(sendSize, 10)}   ${padLeft(name, 20)}   ${ws._ip}\n`
      } else {
        table += `\n`
      }
    }
    try { fs.writeFileSync(require('path').join(__dirname, 'current.txt'), table) } catch (e) {}
  },
  clients: {},
  add: function(ws) {
    let k = current.clients
    let length = 1 + Math.max(...Object.keys(k))
    if(!(length > 0)) {
      k[0] = ws
      ws.s_id = 0
      return
    }
    let i = 0
    while(k[i] && i < length) { i ++ }
    k[i] = ws
    ws.s_id = i
  },
  remove: function(ws) {
    let id = ws.s_id
    if(id >= 0) {
      let k = current.clients
      if(k[id] === ws) {
        delete k[id]
      }
    }
  }
}


