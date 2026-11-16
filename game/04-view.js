  const wallCollideObjects = new WeakMap()

  const View = (function() {
    const View = {
      sliceWidth: 250,
      cellSize: 512,
      rules: {
        fov: {
          bullet: true,
        },
        bullet: {
          fov: true
        }
      },
      canCollide: function(objectA, objectB) {
        return View.rules[objectA.type][objectB.type]
      },
      checkCircle: function(objectA, objectB) {
        const data = {
          dx: objectA.x - objectB.x,
          dy: objectA.y - objectB.y,
          distance: 0,
          size: objectA.size + objectB.size,
          colliding: true
        }
        if(data.dx === 0 && data.dy === 0) {
          data.dy = 1
        }
        return data
      },
      detectCollisions: function(objects, callback, limit) {
        const inverse = 1 / View.sliceWidth
        if(limit >= 0) {
		      limit = Math.ceil(limit / Detector.sliceWidth)
	      } else { limit = -1 }
        const outside = function(left, right) {
          if(limit < 0) { return false }
          let min = 1 + Math.floor(left * inverse)
          let max = 1 + Math.floor(right * inverse)
          return (min > limit || max < 1 - limit)
        }
        const fovs = []
        const grid = new Map()
        const cell = View.cellSize, invCell = 1 / cell
        let objectsLength = objects.length
        for(let i=0;i<objectsLength;i++) {
          const object = objects[i]
          if(object.type === 'fov') {
            const w = object.w || object.size, h = object.h || object.size
            object.left = object.x - w
            object.right = object.x + w
            object.bottom = object.y - h
            object.top = object.y + h
            if(!outside(object.left, object.right)) { fovs.push(object) }
            continue
          }
          if(object.type !== 'bullet') { continue }
          const size = object.size
          object.left = object.x - size
          object.right = object.x + size
          object.bottom = object.y - size
          object.top = object.y + size
          if(outside(object.left, object.right)) { continue }
          object.viewStamp = -1
          const cx0 = Math.floor(object.left * invCell), cx1 = Math.floor(object.right * invCell)
          const cy0 = Math.floor(object.bottom * invCell), cy1 = Math.floor(object.top * invCell)
          for(let cx=cx0;cx<=cx1;cx++) {
            for(let cy=cy0;cy<=cy1;cy++) {
              const key = (cx + 65536) * 131072 + (cy + 65536)
              const bucket = grid.get(key)
              if(bucket) { bucket.push(object) } else { grid.set(key, [object]) }
            }
          }
        }
        let count = 0
        const data = { colliding: true }
        for(let f=0,fl=fovs.length;f<fl;f++) {
          const fov = fovs[f]
          const cx0 = Math.floor(fov.left * invCell), cx1 = Math.floor(fov.right * invCell)
          const cy0 = Math.floor(fov.bottom * invCell), cy1 = Math.floor(fov.top * invCell)
          for(let cx=cx0;cx<=cx1;cx++) {
            for(let cy=cy0;cy<=cy1;cy++) {
              const bucket = grid.get((cx + 65536) * 131072 + (cy + 65536))
              if(!bucket) { continue }
              for(let i=0,l=bucket.length;i<l;i++) {
                const test = bucket[i]
                if(test.viewStamp === f) { continue }
                test.viewStamp = f
                count ++
                if(fov.right >= test.left && fov.left <= test.right && fov.bottom <= test.top && test.bottom <= fov.top) {
                  callback(fov, test, data)
                }
              }
            }
          }
        }
        return count
      }
    }
    return View
  })()

  let clients = []

