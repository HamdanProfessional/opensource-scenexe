const game = {
  tokens: {},
  tokenUses: {},
  generateToken: function() {
    let code = 'openscenexe-'
    for(let i=0;i<55;i++) {
      code += '0123456789abcdef'[Math.floor(Math.random() * 16)]
    }
    if(code in game.tokens) {
      return game.generateToken()
    } else {
      return code
    }
  },
  codes: (function() {
    let codeTable = function(p) {
      let o = {}
      for(let k in p) {
        o[k] = p[k]
        o[p[k]] = k
      }
      return o
    }
    return {
      receive: codeTable({
        ready: 0,
        gameUpdate: 1,
        gameStart: 2,
        announcement: 3,
        death: 4,
        setStats: 5,
        test: 6,
        flag: 7,
        eval: 8,
        waiting: 9,
      }),
      send: codeTable({
        joinGame: 0,
        chat: 1,
        typing: 2,
        passive: 3,
        firing: 4,
        controlPosition: 5,
        upgradeStat: 6,
        upgradeWeapon: 7,
        upgradeBody: 8,
        direction: 10,
        d: 11,
        token: 12,
        result: 13,
        ping: 14,
        captcha: 15,
        login: 16,
        createAccount: 17,
        editTank: 18,
      })
    }
  })()
}

const generator = {
  ids: [],
  getId: function() {
    let ids = generator.ids
    let length = ids.length
    if(length === 0) {
      ids.push(0)
      return 0
    }
    let i = 0
    while(ids[i] === i && i < length) { i ++ }
    ids.splice(i, 0, i)
    return i
  },
  removeId: function(id) {
    let i = generator.ids.indexOf(id)
    if(i >= 0) {
      generator.ids.splice(i, 1)
      delete uids[id]
    }
  }
}

