const leaderboard = {
  cache: {},
  options: {
    0: {
      q: { stars: -1 }
    },
    1: {
      q: { stars: 1 }
    },
    2: {
      q: { maxScore: -1 }
    },
    3: {
      q: { maxScore: 1 }
    }
  },
  get: function(id, max) {
    let j = leaderboard.options[id]
    let then = function() {}
    if(!j || !(max > 0)) {
      setTimeout(function() {
        then()
      })
    } else if(leaderboard.cache[id] && performance.now() - leaderboard.cache[id].t < 5000) {
      setTimeout(function() {
        then(leaderboard.cache[id].r)
      })
    } else {
      setTimeout(function() {
        let r = Accounts.top(j.q, Math.floor(max))
        leaderboard.cache[id] = { t: performance.now(), r: r }
        then(r)
      })
    }
    return {
      then: function(f) {
        then = f
      }
    }
  }
}

const addAchievement = function(accountName, ach, a) {
  const c = function(d) {
    if(d.success) {
      let a = d.account
      let obj = achievements.toObject(a.achievements)
      if(obj[ach.id]) { return }
      a.achievements.push(createAchievement(ach.id, ach.time))
      a.stars += 25
      setTimeout(function() {
        for(let i=clients.length-1;i>=0;i--) {
          let c = clients[i]
          if(c.accountName && c.accountName === accountName) {
            c.sendPacket('announcement', `You earned an achievement! (${achievements.list[ach.id].name}) id:${ach.id}, total:${a.achievements.length}`)
          }
        }
      }, 1000)
      console.log('added', ach.id, 'total', a.achievements.length)
      d.save()
    }
  }
  if(a) {
    return setTimeout(function() {
      let d = accountName
      accountName = d.account.username
      c(d)
    })
  }
  Accounts.fromUsername(accountName).then(function(d) {
    c(d)
  })
}

