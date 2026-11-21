  const wallCollideObjects = new WeakMap()

  const View = (function() {
    const View = {
      cellSize: 512,
      attach: function(fovObject, visible, bullets, polygons) {
        const viewer = fovObject.object
        viewer.fov.bullets = bullets
        viewer.fov.polygons = polygons
        viewer.fovVisible = visible
      },
      _native: null,
      collect: function(objects, limit) {
        const slices = sliceCount(limit)
        if(!native || slices > maxSlices) { return false }
        const n = objects.length
        let buf = View._native
        if(!buf || buf.size < n) {
          const size = Math.max(1024, n * 2)
          buf = View._native = { size: size, geo: new Float64Array(size * 4), kind: new Uint8Array(size), list: new Uint8Array(size), ids: new Float64Array(size), offsets: new Int32Array(size + 1), out: buf ? buf.out : new Int32Array(65536) }
        }
        const geo = buf.geo, kind = buf.kind, list = buf.list, ids = buf.ids
        const fovs = []
        for(let i=0;i<n;i++) {
          const object = objects[i], j = i * 4
          geo[j] = object.x
          geo[j + 1] = object.y
          if(object.type === 'fov') {
            kind[i] = 1
            geo[j + 2] = object.w || object.size
            geo[j + 3] = object.h || object.size
            fovs.push(object)
          } else if(object.type === 'bullet') {
            kind[i] = 2
            geo[j + 2] = object.size
            geo[j + 3] = object.size
            const str = object.str, target = object.object
            list[i] = str === 'tanks' ? 0 : str === 'bullets' ? 1 : str === 'polygons' ? 2 : 3
            ids[i] = target ? target.id : -1
          } else {
            kind[i] = 0
          }
        }
        let total
        try {
          total = native.view(n, geo, kind, list, ids, slices, sliceWidth, View.cellSize, buf.offsets, buf.out)
          if(total > buf.out.length) {
            buf.out = new Int32Array(total * 2)
            total = native.view(n, geo, kind, list, ids, slices, sliceWidth, View.cellSize, buf.offsets, buf.out)
          }
        } catch(e) { return false }
        const offsets = buf.offsets, out = buf.out
        for(let f=0;f<fovs.length;f++) {
          const fovObject = fovs[f]
          const visible = {}, bullets = [], polygons = []
          for(let p=offsets[f],end=offsets[f + 1];p<end;p++) {
            const item = objects[out[p]], c = item.object, str = item.str
            if(str === 'tanks') {
              visible[c.id] = c
            } else if(str === 'bullets') {
              bullets.push(c)
            } else if(str === 'polygons') {
              polygons.push(c)
            }
          }
          View.attach(fovObject, visible, bullets, polygons)
        }
        return true
      },
      _wake: null,
      awake: function(polygons, wake) {
        if(!native) { return null }
        const n = polygons.length, count = wake.length >> 2
        let buf = View._wake
        if(!buf || buf.size < n || buf.wakeSize < count) {
          const size = Math.max(1024, n * 2), wakeSize = Math.max(64, count * 2)
          buf = View._wake = { size: size, wakeSize: wakeSize, polygons: new Float64Array(size * 3), wake: new Float64Array(wakeSize * 4), out: new Uint8Array(size) }
        }
        const p = buf.polygons
        for(let i=0;i<n;i++) {
          const polygon = polygons[i], j = i * 3
          p[j] = polygon.x
          p[j + 1] = polygon.y
          p[j + 2] = polygon.size
        }
        buf.wake.set(wake)
        native.wake(n, p, count, buf.wake, buf.out)
        return buf.out
      },
      detectCollisions: function(objects, callback, limit) {
        const inverse = 1 / sliceWidth
        limit = sliceCount(limit)
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
                if(fov.right >= test.left && fov.left <= test.right && fov.bottom <= test.top && test.bottom <= fov.top) {
                  callback(fov, test)
                }
              }
            }
          }
        }
      }
    }
    return View
  })()

  let clients = []

