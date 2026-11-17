    const setStyleC = function(el, prop, value) {
      const c = el.__sc || (el.__sc = {})
      const e = c[prop]
      const st = el.style
      if(e && e[0] === value && st[prop] === e[1]) { return }
      st[prop] = value
      c[prop] = [value, st[prop]]
    }
    const rgbRound = function(c, alpha) {
      if(!c) { return render.rgb(c, alpha) }
      return render.rgb({ r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) }, alpha)
    }
    const setTextC = function(el, value) {
      value = '' + value
      if(el.__tc === value && el.firstChild && el.firstChild.nodeValue === value && !el.firstChild.nextSibling) { return }
      el.textContent = value
      el.__tc = value
    }
    const text = {
      bold: {},
      none: {},
      padding: 7,
      border: 15,
      generate: function(text, type) {
        let _canvas = document.createElement('canvas')
        let _ctx = _canvas.getContext('2d')
        _ctx.font = '800 50px Roboto'
        let data = _ctx.measureText(text)
        let left = data.actualBoundingBoxLeft > 0 ? data.actualBoundingBoxLeft : 0
        let ascent = data.actualBoundingBoxAscent
        let descent = data.actualBoundingBoxDescent
        let width = left + (data.actualBoundingBoxRight > 0 ? data.actualBoundingBoxRight : 0)
        if(width < data.width) { width = data.width }
        let height = ascent + descent
        _canvas.width = width + 2 * this.padding
        _canvas.height = height + 2 * this.padding
        _ctx.font = '800 50px Roboto'
        _ctx.fillStyle = 'rgb(255, 255, 255)'
        _ctx.miterLimit = 2
        if(type === 'bold') {
          _ctx.strokeStyle = 'rgb(0, 0, 0)'
          _ctx.lineWidth = 15
          _ctx.strokeText(text, this.padding, this.padding + ascent)
        }
        _ctx.fillText(text, this.padding, this.padding + ascent)
        return (this[type][text] = {
          text: text,
          canvas: _canvas,
          width: _canvas.width,
          height: _canvas.height,
          descent: descent / 2,
          x: this.padding,
          y: this.padding + ascent
        })
      },
      get: function(text, type) {
        let data = this[type][text]
        if(!data) {
          data = this.generate(text, type)
        }
        data.used = render.now
        return data
      },
      fill: function(c, color) {
        let d = document.createElement('canvas')
        d.width = c.width
        d.height = c.height
        let e = d.getContext('2d')
        e.fillStyle = render.rgb(color)
        e.font = '800 50px Roboto'
        e.miterLimit = 2
        if(1) {
          e.strokeStyle = 'rgb(0, 0, 0)'
          e.lineWidth = 15
          e.strokeText(c.text, c.x, c.y)
        }
        e.fillText(c.text, c.x, c.y)
        return d
      },
      filter: true,
      filled: {},
      filledCount: 0,
      drawText: function(text, x, y, size, r, color) {
        let data = this.get(text, 'bold')
        if(r) {
          size *= r
        }
        let full = size / 50
        let height = data.height * full
        if(this.filter || render.inFOV({
          x: x,
          y: y + data.descent - height / 2,
          w: data.width * full / 2,
          h: height / 2
        })) {
          render.imageCount ++
          let c = data.canvas
          if(color && color.r + color.g + color.b < 750) {
            let key = text + '|' + (color.r >> 3) + ',' + (color.g >> 3) + ',' + (color.b >> 3)
            c = this.filled[key]
            if(!c) {
              if(++this.filledCount > 400) {
                this.filled = {}
                this.filledCount = 0
              }
              c = this.filled[key] = this.fill(data, color)
            }
          }
          ctx.drawImage(c, x - data.width * full / 2, y - height + data.descent, data.width * full, height)
        }
      },
      drawTextBox: function(text, x, y, size, r, alpha, tail) {
        let data = {}, dots = (text === '...')
        if(!dots) {
          data = this.get(text, 'none')
        }
        if(r) {
          size *= r
        }
        let full = size / 50
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`
        ctx.beginPath()
        let width = (dots ? 120 : (data.width > 40 ? data.width : 40))
        ctx.roundRect(x - (width + this.border * 2 + 2) * full / 2, y - (50 + this.border) * full, (width + 2 * this.border + 4) * full, (50 + 2 * this.border) * full, size * 0.5)
        if(tail > 0) {
          let s = size * 0.4 * tail
          let h = size * 0.3
          ctx.moveTo(x - s, y + h)
          ctx.lineTo(x, y + s + h)
          ctx.lineTo(x + s, y + h)
        }
        ctx.fill()
        ctx.closePath()
        if(data.canvas) {
          let height = data.height * full
          if(alpha < 1) {
            ctx.globalAlpha = alpha
          }
          render.imageCount ++
          ctx.drawImage(data.canvas, x - data.width * full / 2, y - height + data.descent * (r ? r : 1), data.width * full, height)
          if(ctx.globalAlpha < 1) {
            ctx.globalAlpha = 1
          }
        } else if(dots) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.beginPath()
          let now = render.now / 200, c = 3 * r
          for(let i=-1;i<=1;i++) {
            let r = ((Math.sin(now + 200 * i) + 1) / 2)
            r = (r * r + 2) * c
            ctx.ellipse(x + size * i * 0.8, y - size * 0.45, r, r, 0, 0, 2 * Math.PI)
          }
          ctx.fill()
          ctx.closePath()
        }
      }
    }

    setInterval(function() {
      const cutoff = render.now - 3000
      for(const type of ['bold', 'none']) {
        const cache = text[type]
        for(const k in cache) {
          if(!(cache[k].used >= cutoff)) { delete cache[k] }
        }
      }
    }, 1000)

