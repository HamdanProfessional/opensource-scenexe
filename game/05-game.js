  const game = {
    clients: clients,
    codes: args.codes || (function() {
      let k = {
        receive: {
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
        },
        send: {
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
          editTank: 18
        }
      }
      for(let p in k.send) {
        k.send[k.send[p]] = p
      }
      for(let p in k.receive) {
        k.receive[k.receive[p]] = p
      }
      return k
    })(),
    c: {
      receive: {
        0: 'ready',
        'ready': 0,
        1: 'gameUpdate',
        'gameUpdate': 1,
        2: 'gameStart',
        'gameStart': 2,
        3: 'announcement',
        'announcement': 3,
        4: 'death',
        'death': 4,
        5: 'setStats',
        'setStats': 5,
        6: 'test',
        'test': 6,
        7: 'flag',
        'flag': 7,
      },
      send: {
        'joinGame': 14,
        14: 'joinGame',
        'chat': 1,
        1: 'chat',
        'typing': 2,
        2: 'typing',
        'passive': 3,
        3: 'passive',
        'firing': 4,
        4: 'firing',
        'controlPosition': 5,
        5: 'controlPosition',
        'upgradeStat': 6,
        6: 'upgradeStat',
        'upgradeWeapon': 7,
        7: 'upgradeWeapon',
        'upgradeBody': 8,
        8: 'upgradeBody',
        'direction': 10,
        10: 'direction',
        'd': 11,
        11: 'd',
        'token': 17,
        17: 'token',
        'result': 29,
        29: 'result',
        'ping': 31,
        31: 'ping',
        'captcha': 79,
        79: 'captcha'
      }
    }
  }

