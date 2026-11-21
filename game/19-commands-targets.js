  const commands = {
    getTargets: function(selector, me) {
      if(!selector) {
        return
      }
      let list = [], tanks = me.dim.tanks
      switch(selector) {
        case 'lasttank':
          return me.dim.lastTank ? [me.dim.lastTank] : []
        case 'all':
          return me.dim.tanks.concat(me.dim.polygons).concat(me.dim.bullets)
        case 'bullets':
          return me.dim.bullets.slice()
        case 'tanks':
          let arr = []
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(!t.polygon) {
              arr.push(t)
            }
          }
          return arr
        case 'polygons':
          return me.dim.polygons.slice()
        case 'me':
          return [me]
        case 'fallens':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.ai === 'fallen') {
              list.push(t)
            }
          }
          return list
        case 'boss':
        case 'bosses':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.boss === true) {
              list.push(t)
            }
          }
          return list
        case 'pinks':
        case 'celes':
        case 'celestials':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 6) {
              list.push(t)
            }
          }
          return list
        case 'blues':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 1) {
              list.push(t)
            }
          }
          return list
        case 'reds':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 2) {
              list.push(t)
            }
          }
          return list
        case 'greens':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 3) {
              list.push(t)
            }
          }
          return list
        case 'purples':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 4) {
              list.push(t)
            }
          }
          return list
        case 'yellows':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 8) {
              list.push(t)
            }
          }
          return list
          case 'blacks':
            for(let i=tanks.length-1;i>=0;i--) {
              let t = tanks[i]
              if(t.team === 9) {
                list.push(t)
              }
            }
            return list
        case 'others':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t !== me) {
              list.push(t)
            }
          }
          return list
        case 'polyps':
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(t.team === 5) {
              list.push(t)
            }
          }
          return list
        default:
          let sign = selector[0], int = parseInt(selector.slice(1))
          if(int >= 0 && String(int) === selector.slice(1)) {
            if(sign === 't') {
              let tanks = me.dim.tanks
              for(let i=tanks.length-1;i>=0;i--) {
                let tank = tanks[i]
                if(tank.id === int) {
                  return [tank]
                }
              }
            }
            if(sign === 'p') {
              let polygons = me.dim.polygons
              for(let i=polygons.length-1;i>=0;i--) {
                let tank = polygons[i]
                if(tank.id === int) {
                  return [tank]
                }
              }
            }
          }
          let lower = selector.toLowerCase(), starts = []
          for(let i=tanks.length-1;i>=0;i--) {
            let t = tanks[i]
            if(!t.ws || !t.ws.data || !t.ws.data.isPlayer || typeof t.name !== 'string') { continue }
            let n = t.name.toLowerCase()
            if(n === lower) { return [t] }
            if(n.startsWith(lower)) { starts.push(t) }
          }
          if(starts.length === 1) { return starts }
      }
    },
    parse: function(rule, data, tank, ctx) {
      ctx = ctx || {}
      let items = []
      for(let i=0,l=rule.length;i<l;i++) {
        let type = rule[i]
        if(type === 'position') {
          let x = data.splice(0, 1)[0]
          let targets = commands.getTargets(x, tank)
          if(targets && targets.length === 1) {
            items.push([targets[0].x, targets[0].y])
          } else {
            x = parseFloat(x)
            let y = parseFloat(data.splice(0, 1)[0])
            if((x >= 0 || x <= 0) && (y >= 0 || y <= 0)) {
              items.push([x, y])
            } else {
              return {
                ok: false,
                error: `Failed to parse position '${x} ${y}'`
              }
            }
          }
        } else if(type === 'targets') {
          let selector = data.splice(0, 1)[0]
          if(selector === undefined) {
            return { ok: false, error: 'Missing a target (a player name, me, all, tanks, ...)' }
          }
          if(ctx.selfOnly && selector !== 'me') {
            return { ok: false, error: `Here you can only use this on yourself: use 'me' as the target` }
          }
          let targets = commands.getTargets(selector, tank)
          if(targets && targets.length > 0) {
            let allowed = targets.filter(t => t === tank || !(t.ws && t.ws.data && commands.level(t.ws.data.role) > 0 && commands.level(t.ws.data.role) >= (ctx.level || 0)))
            if(allowed.length === 0) {
              return { ok: false, error: `You can't use that on staff of your rank or higher` }
            }
            items.push(allowed)
          } else {
            return {
              ok: false,
              error: `Nobody matches '${selector}'`
            }
          }
        } else if(type === 'int') {
          let text = data.splice(0, 1)[0]
          let int = parseInt(text)
          if(int >= 0 || int <= 0) {
            items.push(int)
          } else {
            return {
              ok: false,
              error: text === undefined ? 'Missing a whole number' : `'${text}' is not a whole number`
            }
          }
        } else if(type === 'float') {
          let text = data.splice(0, 1)[0]
          let int = parseFloat(text)
          if(int >= 0 || int <= 0) {
            items.push(int)
          } else {
            return {
              ok: false,
              error: text === undefined ? 'Missing a number' : `'${text}' is not a number`
            }
          }
        } else if(type === 'string') {
          let text = data.splice(0, 1)[0]
          if(text === undefined) {
            return { ok: false, error: 'Missing a word' }
          }
          items.push(text)
        } else if(type === '?') {
          items.push(data.join(' '))
          data = []
          break
        } else if(type === '*') {
          if(data.length === 0) {
            return { ok: false, error: 'Missing text' }
          }
          items.push(data.join(' '))
          data = []
          break
        }
      }
      if(data.length > 0) {
        return {
          ok: false,
          error: `Too many arguments: '${data.join(' ')}'`
        }
      }
      return items
    },
