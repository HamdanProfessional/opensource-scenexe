    const util = {
      powers: {},
      average: function (a, b, c) {
        let d
        if(c in util.powers) {
          d = util.powers[c]
        } else {
          d = util.powers[c] = 1 - Math.pow(c / (c + 1), render.f)
        }
        return a + (b - a) * d
      },
      averageAngle: function (a, b, c) {
        let d = 2 * Math.PI;
        a = ((a % d) + d) % d;
        let e = (d + b - a) % d;
        if (e > Math.PI) {
          return (((a + (e - d) / (c + 1)) % d) + d) % d;
        } else {
          return (((a + e / (c + 1)) % d) + d) % d;
        }
      },
      slideAngle: function (a, b, c) {
        let d = 2 * Math.PI;
        a = ((a % d) + d) % d;
        b = ((b % d) + d) % d;
        let e = 0
        if(b > a) {
          if(b - a < Math.PI) {
            e = a * (1 - c) + b * c
          } else {
            e = (a + d) * (1 - c) + b * c
          }
        } else {
          if(b + d - a < Math.PI) {
            e = a * (1 - c) + (b + d) * c
          } else {
            e = a * (1 - c) + b * c
          }
        }
        return ((e % d) + d) % d;
      },
      mouse: {
        down: false,
        right: false,
        screenX: 0,
        screenY: 0,
        d: 0,
        sent: 0,
        lastSent: 0,
      }
    }
    let cameraXv = 0, cameraYv = 0
    let cameraX = 0, cameraY = 0, cameraRx = 0, cameraRy = 0, cameraTargetX = 0, cameraTargetY = 0, cameraSize = 1, cameraBaseSize = 1, cameraZoom = 1, cameraZoomScale = 1, cameraShake = 0
