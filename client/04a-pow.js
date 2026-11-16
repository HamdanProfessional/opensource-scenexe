    const powTicket = (function() {
      const K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ])
      const W = new Int32Array(64)
      const sha0 = function(str) {
        const l = str.length, n = ((l + 72) >> 6) << 6
        const m = new Uint8Array(n)
        for(let i=0;i<l;i++) { m[i] = str.charCodeAt(i) }
        m[l] = 0x80
        const bl = l * 8
        m[n - 4] = bl >>> 24
        m[n - 3] = (bl >>> 16) & 255
        m[n - 2] = (bl >>> 8) & 255
        m[n - 1] = bl & 255
        let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a, h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
        for(let o=0;o<n;o+=64) {
          for(let i=0;i<16;i++) {
            const q = o + i * 4
            W[i] = (m[q] << 24) | (m[q + 1] << 16) | (m[q + 2] << 8) | m[q + 3]
          }
          for(let i=16;i<64;i++) {
            const x = W[i - 15], y = W[i - 2]
            const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)
            const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10)
            W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0
          }
          let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7
          for(let i=0;i<64;i++) {
            const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
            const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0
            const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
            const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0
            h = g
            g = f
            f = e
            e = (d + t1) | 0
            d = c
            c = b
            b = a
            a = (t1 + t2) | 0
          }
          h0 = (h0 + a) | 0
          h1 = (h1 + b) | 0
          h2 = (h2 + c) | 0
          h3 = (h3 + d) | 0
          h4 = (h4 + e) | 0
          h5 = (h5 + f) | 0
          h6 = (h6 + g) | 0
          h7 = (h7 + h) | 0
        }
        return h0 >>> 0
      }
      const solve = function(t) {
        const bits = Number(t.split('.')[2]) | 0, pre = t + ':'
        return new Promise(function(resolve) {
          let i = 0
          const step = function() {
            const end = i + 20000
            for(;i<end;i++) {
              const n = i.toString(36)
              if(bits <= 0 || (sha0(pre + n) >>> (32 - bits)) === 0) {
                return resolve({ t: t, n: n })
              }
            }
            setTimeout(step, 0)
          }
          step()
        })
      }
      const get = function(origin) {
        return fetch(origin.replace(/^ws/, 'http') + '/ticket', { cache: 'no-store' }).then(function(r) { return r.json() }).then(function(d) {
          return solve(d.t)
        })
      }
      get.sha0 = sha0
      return get
    })()
