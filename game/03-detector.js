  const Detector = (function() {
    const Detector = {
      sliceWidth: 250,
      rules: {
        tank: {
          tank: true,
          detectEnemies: true,
          detectFriends: true,
          bullet: true,
          polygon: true,
          wall: true,
          gate: true,
          wormhole: true,
        },
        detectEnemies: {
          tank: true,
          polygon: true,
          bullet: true,
        },
        bullet: {
          tank: true,
          bullet: true,
          polygon: true,
          wall: true,
          gate: true,
          wormhole: true,
          detectEnemies: true,
        },
        polygon: {
          tank: true,
          bullet: true,
          detectEnemies: true,
          polygon: true,
          wall: true,
          gate: true,
          wormhole: true,
        },
        detectFriends: {
          tank: true,
        },
        wall: {
          tank: true,
          bullet: true,
          polygon: true,
        },
        gate: {
          tank: true,
          bullet: true,
          polygon: true,
        },
        wormhole: {
          tank: true,
          bullet: true,
          polygon: true,
        }
      },
      canCollide: function(objectA, objectB) {
        if(objectA.noCollide || objectB.noCollide) { return false }
        if(objectA.type === 'bullet' && objectB.type === 'bullet') {
          if(dimension.isSameTeam(objectA.object, objectB.object)) {
            if(objectA.object.type === objectB.object.type) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        }
        return Detector.rules[objectA.type][objectB.type]
      },
      checkCircle: function(objectA, objectB) {
        const data = {
          dx: objectA.x - objectB.x,
          dy: objectA.y - objectB.y,
          distance: 0,
          size: objectA.size + objectB.size,
          colliding: false
        }
        data.distance = data.dx * data.dx + data.dy * data.dy

        if(data.distance < data.size * data.size) {
          data.colliding = true
        }
        if(data.dx === 0 && data.dy === 0) {
          data.dy = 1
        }
        return data
      },
      checkRect: function(rect, circle) {
        if(circle.rectangular) {
          [rect, circle] = [circle, rect]
        }
        let data = {
          dx: circle.x - rect.x,
          dy: circle.y - rect.y,
          colliding: true,
          rect: rect,
          circle: circle,
        }
        if(rect.noClip) {
          data.size = circle.size
        } else {
          data.size = circle.size < 2 * dimension.clipSize ? circle.size / 2 : circle.size - dimension.clipSize
        }
        data.inX = (circle.x + data.size > rect.left && circle.x - data.size < rect.right)
        data.inY = (circle.y + data.size > rect.bottom && circle.y - data.size < rect.top)
        let r = circle.size - data.size
        data.cinX = (circle.x > rect.left + r && circle.x < rect.right - r)
        data.cinY = (circle.y > rect.bottom + r && circle.y < rect.top - r)
        if((data.inX && data.cinY) || (data.inY && data.cinX)) {
          data.hitSide = true
          return data
        } else {
          data.cx = circle.x < rect.x ? rect.left + r : rect.right - r
          data.cy = circle.y < rect.y ? rect.bottom + r : rect.top - r
          data.dcx = circle.x - data.cx
          data.dcy = circle.y - data.cy
          data.distance = data.dcx * data.dcx + data.dcy * data.dcy
          if(data.distance >= circle.size * circle.size) {
            data.colliding = false
          }
          return data
        }
      },
      typeCodes: { tank: 0, detectEnemies: 1, detectFriends: 2, bullet: 3, polygon: 4, wall: 5, gate: 6, wormhole: 7 },
      typeCount: 8,
      pairRules: null,
      _buffers: null,
      buffers: function(size) {
        let b = Detector._buffers
        if(!b || b.size < size) {
          const cap = Math.max(1024, size * 2)
          b = Detector._buffers = {
            size: cap,
            keys: new Float64Array(cap),
            order: new Uint32Array(cap),
            L: new Float64Array(cap),
            R: new Float64Array(cap),
            B: new Float64Array(cap),
            T: new Float64Array(cap),
            SMIN: new Int32Array(cap),
            TYPE: new Uint8Array(cap),
            included: b ? b.included : [],
            sorted: b ? b.sorted : [],
          }
        }
        return b
      },
      detectCollisions: function(objects, callback, limit) {
        const inverse = 1 / Detector.sliceWidth
        let objectsLength = objects.length
	      if(limit >= 0) {
		      limit = Math.ceil(limit / Detector.sliceWidth)
	      } else { limit = -1 }

        const buf = Detector.buffers(objectsLength)
        const included = buf.included
        included.length = 0
        const typeCodes = Detector.typeCodes
        for(let i=0;i<objectsLength;i++) {
          const object = objects[i]
          let w = object.w || object.size
          let h = object.h || object.size
          object.left = object.x - w
          object.right = object.x + w
          object.bottom = object.y - h
          object.top = object.y + h
          object.w = w
          object.h = h
          object.internalId = i
          let min = 1 + Math.floor(object.left * inverse)
          let max = 1 + Math.floor(object.right * inverse)
          if(limit >= 0) {
            if(min > limit || max < 1 - limit) { continue }
            if(max > limit) { max = limit }
            if(min < 1 - limit) { min = 1 - limit }
          }
          object.sliceMin = min
          object.sliceMax = max
          included.push(object)
        }
        const n = included.length
        const keys = buf.keys, order = buf.order
        for(let i=0;i<n;i++) {
          keys[i] = included[i].bottom
          order[i] = i
        }
        const orderView = order.subarray(0, n)
        orderView.sort((a, b) => keys[a] - keys[b])

        const sorted = buf.sorted
        sorted.length = n
        const L = buf.L, R = buf.R, B = buf.B, T = buf.T, SMIN = buf.SMIN, TYPE = buf.TYPE
        const slices = new Map()
        for(let k=0;k<n;k++) {
          const object = included[orderView[k]]
          sorted[k] = object
          L[k] = object.left
          R[k] = object.right
          B[k] = object.bottom
          T[k] = object.top
          SMIN[k] = object.sliceMin
          const code = typeCodes[object.type]
          TYPE[k] = (code === undefined || object.noCollide) ? 255 : code
          for(let i=object.sliceMin,max=object.sliceMax;i<=max;i++) {
            let slice = slices.get(i)
            if(slice) {
              slice.push(k)
            } else {
              slices.set(i, [k])
            }
          }
        }
        const pairRules = Detector.pairRules, typeCount = Detector.typeCount, bulletCode = typeCodes.bullet
        let count = 0

        for(const [sliceId, slice] of slices) {
          const l = slice.length - 1
          if(l < 1) { continue }
          for(let i=0;i<l;i++) {
            const a = slice[i]
            const typeA = TYPE[a]
            if(typeA === 255) { continue }
            const top = T[a], left = L[a], right = R[a], sminA = SMIN[a]
            const ruleRow = typeA * typeCount

            for(let u=i+1;u<=l;u++) {
              const b = slice[u]
              count ++
              if(B[b] > top) {
                break
              }
              if(right < L[b] || left > R[b]) { continue }
              const typeB = TYPE[b]
              if(typeB === 255 || !pairRules[ruleRow + typeB]) { continue }
              if((sminA > SMIN[b] ? sminA : SMIN[b]) !== sliceId) { continue }
              const object = sorted[a], test = sorted[b]
              if(typeA === bulletCode && typeB === bulletCode) {
                const oa = object.object, ob = test.object
                if(dimension.isSameTeam(oa, ob) && oa.type !== ob.type) { continue }
                const ca = dimension.bulletClass[oa.type], cb = dimension.bulletClass[ob.type]
                if(!(ca === cb && ca !== 0) && dimension.isSameTeam(oa.parent, ob.parent)) { continue }
              }

              if(object.rectangular || test.rectangular) {
                if(object.rectangular ^ test.rectangular) {
                  const data = Detector.checkRect(object, test)
                  if(data.colliding) {
                    callback(data.circle, data.rect, data)
                  }
                }
              } else {
                let dx = object.x - test.x, dy = object.y - test.y
                const size = object.size + test.size
                const distance = dx * dx + dy * dy
                if(distance < size * size) {
                  if(dx === 0 && dy === 0) { dy = 1 }
                  callback(object, test, { dx: dx, dy: dy, distance: distance, size: size, colliding: true })
                }
              }
            }
          }
        }
        return count
      }
    }
    Detector.pairRules = new Uint8Array(Detector.typeCount * Detector.typeCount)
    for(let a in Detector.typeCodes) {
      for(let b in Detector.typeCodes) {
        if((Detector.rules[a] && Detector.rules[a][b]) || (a === 'bullet' && b === 'bullet')) {
          Detector.pairRules[Detector.typeCodes[a] * Detector.typeCount + Detector.typeCodes[b]] = 1
        }
      }
    }
    return Detector
  })()

