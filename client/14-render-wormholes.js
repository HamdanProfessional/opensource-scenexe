      drawWormhole: function (wormhole) {
        wormhole.size = util.average(wormhole.size, wormhole._size, 5)
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = render.lineWidth;
        let transform = ctx.getTransform();
        ctx.translate(wormhole.x, wormhole.y);
        let now = render.now / 1000, fade;
        let color = render.averageColors(
          render.radiantColor,
          { r: 0, g: 0, b: 0 },
          0.15
        );
        switch (wormhole.type) {
          case 0:
            for(let i=0,l=render.round(render.particles * 0.4);i<l;i++) {
              let d = Math.random() * 2 * Math.PI;
              let cos = Math.cos(d);
              let sin = Math.sin(d);
              let size =
                  ((30 + Math.random() * 20) * wormhole.size) /
                  (wormhole.ruptured ? 60 : 75);
              let s = wormhole.size - size
              let x = wormhole.x + cos * s;
              let y = wormhole.y + sin * s;
              let speed = 2 + Math.random() * (1 + 2 * wormhole.ruptured);
              render.particlesUnder.push(render.createParticle({
                ox: x,
                oy: y,
                nx: x + cos * speed * 75,
                ny: y + sin * speed * 75,
                size: size,
                d: 1 / 75,
                fade: 10,
                color: wormhole.color || { r: 255, g: 255, b: 255 },
                radiant: wormhole.radiant
              }))
            }
            now *= 2 / 3;
            now = now - Math.floor(now);
            color = wormhole.radiant
              ? render.averageColors(color, { r: 255, g: 255, b: 255 }, 0.75)
            : wormhole.color || { r: 255, g: 255, b: 255 };
            for (let i = 1; i >= 0; i--) {
              let t = (i + now) / 2;
              render.setFillStroke(color, (1 - t) / 7);
              render.drawCircle({
                x: 0,
                y: 0,
                size: wormhole.size * (1 + 2.5 * t),
              });
            }
            fade = (2 - (wormhole.fadeTime + 1 || 2)) * 255;
            now = render.now;
            if (wormhole.ruptured) {
              let transform = ctx.getTransform();
              ctx.rotate((now / 5000) % (2 * Math.PI));
              render.drawStarShape({
                size1: wormhole.size * 0.4,
                size2: wormhole.size * 5,
                color: color,
                sides: 3,
              });
              ctx.setTransform(transform);
              let d = (render.now / 500) % (12 * Math.PI);
              ctx.rotate(d / 2);
              let size1 =
                  1.5 *
                  wormhole.size *
                  (Math.cos(render.now / 500 + Math.PI) / 2 + 1);
              let size2 =
                  1.5 * wormhole.size * (Math.cos(render.now / 500) / 2 + 1);
              render.drawStarShape({
                size1: size1,
                size2: size1 / 2,
                color: color,
                sides: 6,
              });
              ctx.rotate(-d);
              render.drawStarShape({
                size1: size2,
                size2: size2 / 2,
                color: color,
                sides: 6,
              });
              ctx.setTransform(transform);
            }
            render.setFillStroke(
              wormhole.radiant
              ? render.averageColors(
                render.averageColors(
                  render.radiantColor,
                  { r: 0, g: 0, b: 0 },
                  0.25
                ),
                color,
                fade / 255
              )
              : { r: fade, g: fade, b: fade }
            );
            render.drawCircle({
              x: 0,
              y: 0,
              size: wormhole.size,
            });
            if (wormhole.ruptured) {
              let transform = ctx.getTransform();
              ctx.rotate((render.now / 2000) % (2 * Math.PI));
              for (let i = 0; i < 6; i++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4, 0);
                ctx.lineTo(0, wormhole.size * 1.5);
                ctx.lineTo(wormhole.size / 4, 0);
                ctx.stroke();
                ctx.closePath();
              }
              ctx.rotate(-(render.now / 1000) % (2 * Math.PI));
              for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4, 0);
                ctx.lineTo(0, wormhole.size * 1.3);
                ctx.lineTo(wormhole.size / 4, 0);
                ctx.stroke();
                ctx.closePath();
              }
              ctx.setTransform(transform);
              render.drawCircle({
                x: 0,
                y: 0,
                size: wormhole.size,
              });
              ctx.rotate((render.now / 2000) % (2 * Math.PI));
              for (let i = 0; i < 6; i++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4 + 4.5, 0);
                ctx.lineTo(0, wormhole.size * 1.5 - 5);
                ctx.lineTo(wormhole.size / 4 - 4.5, 0);
                ctx.fill();
                ctx.closePath();
              }
              ctx.rotate(-(render.now / 1000) % (2 * Math.PI));
              for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4 + 3, 0);
                ctx.lineTo(0, wormhole.size * 1.3 - 4);
                ctx.lineTo(wormhole.size / 4 - 3, 0);
                ctx.fill();
                ctx.closePath();
              }
            }
            break;
          case 1:
            for(let i=0,l=render.round(render.particles * 0.7);i<l;i++) {
              let d = Math.random() * 2 * Math.PI;
              let x = Math.cos(d);
              let y = Math.sin(d);
              let size =
                  ((30 + Math.random() * (wormhole.ruptured ? 30 : 10)) *
                   wormhole.size) /
                  (wormhole.ruptured ? 105 : 125);
              let s = wormhole.size - size;
              let speed =
                  (wormhole.ruptured ? 2 : 1) +
                  Math.random() * (1 + 2 * wormhole.ruptured);

            }
            let radiantColor = render.averageColors(
              render.radiantColor,
              { r: 255, g: 255, b: 255 },
              0.5
            );
            if (wormhole.ruptured) {
              let transform = ctx.getTransform();
              now = render.now;
              ctx.rotate((now / 5000) % (2 * Math.PI));
              render.drawStarShape({
                size1: wormhole.size * 0.4,
                size2: wormhole.size * 5,
                color: radiantColor,
                sides: 3,
              });
              ctx.setTransform(transform);
              let d = (render.now / 500) % (12 * Math.PI);
              ctx.rotate(d / 2);
              let size1 =
                  1.5 *
                  wormhole.size *
                  (Math.cos(render.now / 500 + Math.PI) / 2 + 1);
              let size2 =
                  1.5 * wormhole.size * (Math.cos(render.now / 500) / 2 + 1);
              render.drawStarShape({
                size1: size1,
                size2: size1 / 2,
                color: radiantColor,
                sides: 6,
              });
              ctx.rotate(-d);
              render.drawStarShape({
                size1: size2,
                size2: size2 / 2,
                color: radiantColor,
                sides: 6,
              });
              ctx.setTransform(transform);
            }
            now = render.now / 1000;
            ctx.rotate((now / 4) % (2 * Math.PI));
            now = now - Math.floor(now);
            for (let i = 1; i >= 0; i--) {
              let t = (i + now) / 2;
              render.setFillStroke(radiantColor, (1 - t) / 5);
              render.drawCircle({
                x: 0,
                y: 0,
                size: wormhole.size * (1 + 2.5 * t),
              });
            }
            radiantColor = render.averageColors(
              radiantColor,
              { r: 0, g: 0, b: 0 },
              wormhole.fadeTime
            );
            render.drawStarShape({
              color: render.averageColors(
                render.radiantColor,
                radiantColor,
                1 - 0.85
              ),
              size1: wormhole.size,
              size2: wormhole.size * 1.1,
              sides: 12,
            });
            if (wormhole.ruptured) {
              render.setFillStroke(
                render.averageColors(
                  render.radiantColor,
                  radiantColor,
                  1 + now * 0.225
                )
              );
              let transform = ctx.getTransform();
              ctx.rotate((render.now / 2000) % (2 * Math.PI));
              for (let i = 0; i < 6; i++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4, 0);
                ctx.lineTo(0, wormhole.size * 1.5);
                ctx.lineTo(wormhole.size / 4, 0);
                ctx.stroke();
                ctx.closePath();
              }
              ctx.rotate(-(render.now / 1000) % (2 * Math.PI));
              for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4, 0);
                ctx.lineTo(0, wormhole.size * 1.3);
                ctx.lineTo(wormhole.size / 4, 0);
                ctx.stroke();
                ctx.closePath();
              }
              ctx.setTransform(transform);
              render.drawCircle({
                x: 0,
                y: 0,
                size: wormhole.size - render.lineWidth * 0.5,
                fillOnly: true,
              });
              ctx.rotate((render.now / 2000) % (2 * Math.PI));
              for (let i = 0; i < 6; i++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4 + 4.5, 0);
                ctx.lineTo(0, wormhole.size * 1.5 - 5);
                ctx.lineTo(wormhole.size / 4 - 4.5, 0);
                ctx.fill();
                ctx.closePath();
              }
              ctx.rotate(-(render.now / 1000) % (2 * Math.PI));
              for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(-wormhole.size / 4 + 3, 0);
                ctx.lineTo(0, wormhole.size * 1.3 - 4);
                ctx.lineTo(wormhole.size / 4 - 3, 0);
                ctx.fill();
                ctx.closePath();
              }
            }
            for (let i = 4; i >= 0; i--) {
              let t = (i + now) / 4;
              render.setFillStroke(
                render.averageColors(
                  render.radiantColor,
                  radiantColor,
                  t * (wormhole.ruptured ? 0.3 : 0.9) +
                  (wormhole.ruptured ? 0.7 : 0.1)
                )
              );
              render.drawCircle({
                x: 0,
                y: 0,
                size: wormhole.size * (t < 1 ? t : 1),
              });
            }
            break;
          case 2:
            let d = render.now / 2500;
            let s = wormhole.size * 1.2;
            let _d = [Math.sin(d), Math.cos(d)];
            let dx = _d[0] * s;
            let dy = _d[1] * s;
            for(let i=0,l=render.round(render.particles * 0.3 * wormhole.size / 100);i<l;i++) {
              let a = Math.random() * 2 * Math.PI
              let sin = Math.sin(a), cos = Math.cos(a)
              let r = Math.random()
              let m = Math.random() * 2 * Math.PI
              let msin = Math.sin(m), mcos = Math.cos(m)
              r = (1 - r * r) * (wormhole.size - 5)
              let x = wormhole.x + sin * r, y = wormhole.y + cos * r
              render.particlesOver.push(render.createParticle({
                ox: x,
                oy: y,
                nx: x + msin * 15,
                ny: y + mcos * 15,
                size: 5 + (3 * Math.random()),
                d: 1 / 40,
                fade: 20,
                color: wormhole.color || { r:0, g:0, b:0 },
                radiant: wormhole.cRadiant || 0,
                maxAlpha: 0.3
              }))
            }
            let c = render.getRadiantColor(wormhole.color, wormhole.cRadiant)
            render.setFillStroke(c);
            ctx.lineCap = ctx.lineJoin = "round";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(dx, -dy);
            ctx.lineTo(-dy, -dx);
            ctx.lineTo(-dx, dy);
            ctx.lineTo(dy, dx);
            ctx.lineTo(dx, -dy);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            s = (1.8 + Math.sin(render.now / 750) * 0.4) * s;
            render.setFillStroke(c, 0.4);
            dx = _d[0] * s;
            dy = _d[1] * s;
            ctx.beginPath();
            ctx.moveTo(dx, -dy);
            ctx.lineTo(-dy, -dx);
            ctx.lineTo(-dx, dy);
            ctx.lineTo(dy, dx);
            ctx.lineTo(dx, -dy);
            ctx.fill();
            ctx.closePath();
            s += 5 * Math.SQRT2 * 0.5;
            dx = _d[0] * s;
            dy = _d[1] * s;
            render.setFillStroke(c, 0.7);
            ctx.beginPath();
            ctx.moveTo(dx, -dy);
            ctx.lineTo(-dy, -dx);
            ctx.lineTo(-dx, dy);
            ctx.lineTo(dy, dx);
            ctx.lineTo(dx, -dy);
            ctx.stroke();
            ctx.closePath();
            break;
          case 3:
            var AB = NY("#ffffff", false, 10);

            let time = render.now / 500
            var AG = time + 0.5;
            var remainder = time - Math.floor(time);
            var AX = AG - Math.floor(AG);
            var AF = 10 - remainder * 9;
            var Az = 10 - AX * 9;
            var Aj = Math.sin(time / 5) * 5;
            ctx.globalAlpha = Math.min(remainder * 2, 1) * 0.2;
            OA(rift.x, rift.y, rift.size * AF, AB, -10, Aj, true, 1, rift.size * AF * 0.9);
            ctx.globalAlpha = Math.min(AX * 2, 1) * 0.2;
            OA(rift.x, rift.y, rift.size * Az, AB, -8, Aj, true, 1, rift.size * Az * 0.9);
            ctx.globalAlpha = 1;
            var S0 = rift.backgroundColor;
            var S1 = rift.gridColor;
            var S2 = rift.gridSize;
            var S3 = 5 / DU;
            OA(rift.x, rift.y, riftSize, S0, 0, 0, true, 0);
            if (S3 > 0.3) {
              var S4 = S2 / DU;
              var S5 = DK.width / 2 + (rift.x - DR) / DU;
              var S6 = DK.height / 2 + (rift.y - DQ) / DU;
              var S7 = riftSize / DU;
              var S8 = S5 - S7;
              var S9 = S6 - S7;
              var SC = S5 + S7;
              var SV = S6 + S7;
              var SL = -rift.x / DU % S4;
              var SI = -rift.y / DU % S4;
              ctx.lineWidth = S3;
              ctx.strokeStyle = S1;
              ctx.beginPath();
              for (var SE = S8 + SL; SE < SC; SE += S4) {
                var SK = Math.sqrt(1 - Math.pow(Math.abs(SE - S5) / S7, 2)) * S7;
                ctx.moveTo(SE, S6 - SK);
                ctx.lineTo(SE, S6 + SK);
              }
              for (var SH = S9 + SI; SH < SV; SH += S4) {
                var SZ = Math.sqrt(1 - Math.pow(Math.abs(SH - S6) / S7, 2)) * S7;
                ctx.moveTo(S5 - SZ, SH);
                ctx.lineTo(S5 + SZ, SH);
              }
              ctx.stroke();
            }
            for (var SM = nH(n9(rift.size * 0.12, 10, 20)), SJ = rift.size / SM * 4, SD = Math.sin(time / 2) * 0.2 + Math.PI / 2, SN = Math.sin(now / 10) * 10, SY = 0; SY < SM; SY++) {
              var SO = SY / SM * Math.PI * 2 + SN;
              var SW = rift.size * (1 + Math.sin(SO - SN + time * 3) * 0.05);
              var Sq = 1 + Math.sin(SO - SN + time / 2) * 0.05;
              OA(rift.x + Math.sin(SO) * SW, rift.y + Math.cos(SO) * SW, SJ * Sq, AB, -2, SD - SO, true, 1, SJ * 0.85);
            }
            for (var SA = Math.min(1, rift.size / 30) * 30 * Math.min(deltaTime, 0.1) * E9, SS = Math.random(); SS < SA; SS += Math.random()) {
              if (Math.random() < 0.1) {
                var SU = Math.random() * Math.PI * 2;
                var SP = pq(1, 2);
                var SR = pq(60, 120);
                OF(riftX, riftY, SP * Math.sin(SU), SP * Math.cos(SU), pq(4, 8), Math.random() * Math.PI * 2, 0, "#ffffff", SR, 1, 10);
              } else {
                var SQ = Math.random() * Math.PI * 2;
                var SB = pq(3, 5) * Math.max(1, riftSize / 30);
                var SG = pq(30, 60);
                var ST = SB * SG;
                OF(riftX + -Math.sin(SQ) * ST, riftY + -Math.cos(SQ) * ST, SB * Math.sin(SQ), SB * Math.cos(SQ), pq(4, Math.max(1, riftSize / 15) * 8), Math.random() * Math.PI * 2, 0, "#ffffff", SG, 1, 10, 1, false, rift.id);
              }
            }
            break;
        }
        ctx.setTransform(transform);
      },
