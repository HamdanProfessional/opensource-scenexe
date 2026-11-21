# Tank codes

The Scenexe tank editor exports a tank as one code: base64 of a zlib stream holding a msgpack object. This spec covers reading those codes and running the tanks they describe, so a code can be added as a boss or loaded by staff.

The legacy format (zlib + JSON with a `type` field) is handled by the in-game editor and is not covered here.

## Decoding

1. Strip whitespace, turn `-` and `_` into `+` and `/`, and base64 decode.
2. Inflate with zlib.
3. Unpack as msgpack. If that fails, try JSON.

Reject the code if any step fails, if the result is over 2 MB once inflated, or if it has no `render` array.

## Top level

| Field | Meaning |
| --- | --- |
| `name` | Tank name, up to 50 characters. |
| `render` | List of nodes drawn from first to last. |
| `data.maxHealth`, `data.bodyDamage`, `data.movementSpeed` | Base stats. |
| `data.cameraSize` | How far the tank sees. |
| `data.color` | Body color as a 24-bit number. |

`healthBarType`, `damageFlash`, `removeType` and `icon` only affect the Scenexe editor and are ignored.

## Nodes

Every node has a `type`. Positions and sizes are in units of the parent section's size, and angles are radians. The top level counts as a section of size 1, which is the tank's radius.

### section

A group of nodes that moves and turns together.

| Field | Meaning |
| --- | --- |
| `x`, `y`, `d`, `size` | Place, angle and scale inside the parent. |
| `render` | Child nodes. |
| `rotationData` | How the section turns, see below. |
| `layer`, `renderLayer` | Draw order, see Layers. |
| `overrideColor` | Color used by children whose color is `inherit`. |

Rotation behaviors:

| `behavior` | Turns |
| --- | --- |
| `fixed` | Not at all. Keeps `d`. |
| `manual` | Not at all. Keeps `d`. The editor sets it by hand. |
| `constant` | By `rotationSpeed` radians per second. |
| `mouse` | Toward the tank's aim point. |
| `auto` | Toward the nearest enemy within `detectRange`, keeps it until it is past `forgetRange`, and turns back to `defaultDirection` when it has none. Ranges are in tank radii. `rangeRelative: "top"` measures from the tank, not the section. |

`relative: "parent"` adds the parent's angle. `relative: "none"` measures the angle from the world, so a constant spinner keeps its own spin while the tank turns.

### polygon

| Field | Meaning |
| --- | --- |
| `polygonData.sides` | 0 is a circle, 3 or more is a regular polygon, and negative is a star with that many points. |
| `polygonData.inner` | For stars, the inner radius as a fraction of `size`. |
| `polygonData.size`, `x`, `y`, `d` | Size and place inside the section. |
| `color` | 24-bit color, or `inherit`. |
| `stroke` | Outline darkness, 30 is the normal outline. |
| `strokeAlpha` | Outline opacity, 0 hides it. |
| `fixedLineWidth` | Outline width. Missing uses the normal width, and 0 means no outline. |
| `occlude: "scenexeBaseBase"` | A body shape that covers the roots of the section's barrels, see Layers. |
| `overrideRadiant` | Radiant glow strength on this shape. |
| `gradient` | Fill gradient between `colors`. |

### path

A freehand shape made of `moveTo` and `lineTo` points (`x`, `y` in section units). `rx` and `ry` are editor screen positions and are ignored, and so are `w` and `h`, since the points already line up with the barrels they decorate. `stroke`, `strokeColor` and `fixedLineWidth` style the outline, and `reverseOrder` draws it before its siblings.

### barrel

| Field | Meaning |
| --- | --- |
| `btype` | Kind, see below. |
| `x`, `y`, `d`, `w`, `h` | The barrel turns by `d` around the section center, then starts at (`x`, `y`). Full width is `2w` and length is `2h`, the same as the game's own barrels. |
| `color` | Barrel color. |
| `data.reload` | Seconds between shots. |
| `data.offset` | Delay before the first shot, as a fraction of `reload`. |
| `data.recoil` | Push on the tank per shot. |
| `data.bulletSpeed`, `bulletDamage`, `bulletHealth`, `bulletTime`, `bulletSize`, `bulletDensity` | Projectile stats. `bulletTime` is in seconds. |
| `data.bulletSpray`, `bulletSpeedVariance` | Random spread of angle and speed. |
| `data.bulletColor` | `inherit` uses the tank's team color, `inherit-top` the color of the top-level tank. |
| `data.visualOnly` | The barrel is drawn but never fires. |
| `data.wall` | The projectile blocks other projectiles. |
| `data.bulletCode` | A tank code whose `render` is the projectile's look. Any barrel kind can have one, and auras in it hurt enemies around each projectile. |
| `maxDrones` | Most drones alive at once from this barrel. |

Barrel kinds:

| `btype` | Kind |
| --- | --- |
| 0 | Bullet |
| 3 | Custom bullet, drawn with `bulletCode` |
| 4 | Trap: slows to a stop and stays for `bulletTime` |
| 5 | Drone, follows the aim point |

### scenexe-aura

A ring around the tank that hurts enemies inside it. `auraSize` and `auraInnerSize` give the ring, `auraDamage` the damage per second, `auraHealthSteal` the share of damage healed, and `auraColor`, `auraAlpha`, `auraPassiveColor` and `auraPassiveAlpha` its look. `hideBase` and `hideAura` only hide the center shape or the ring. A hidden aura still does damage.

## Layers

- A section's `layer` sets the order for the shapes directly inside it. Lower layers draw first, and shapes on the same layer keep their list order. Unknow Remaster uses -2, 0, 255 and 256.
- Inside a section, barrels listed after the first body shape are drawn just before it, so the body covers the barrel roots and turrets listed after the body stay on top.
- Paths with `reverseOrder` draw before everything else in their section.

## Limits

The loader enforces these limits so a code can't lag the server:

| Limit | Value |
| --- | --- |
| Nodes in one tank | 6000 |
| Section depth | 12 |
| Barrels that fire | 120 |
| Custom bullet looks | 64 different ones |
| Bullets alive per barrel | 20 |
| Drones per barrel | 10 |

Barrels with `visualOnly` are drawn but never simulated, so they don't count toward the firing limit. A code that breaks a limit is still loaded, with the extra barrels made visual-only, and the loader reports what it changed.

## How it fits the game

Codes live in `tankData/codes/<name>.txt`. A body with `"code": "<name>"` uses that code instead of its barrels, turrets and visual elements. Every code file also gets a `code:<name>` body and weapon when tank data loads, so adding a file and restarting is all a new code needs. The server loads every code at startup and serves the drawing data at `/tankcode?n=<name>`, without the gameplay fields. The client fetches it the first time it sees the tank and keeps it.

- The server works out each section's angle every tick and fires the barrels from their world positions.
- The client works out constant spins and aim on its own. `auto` sections use their resting angle until the server sends the angles.
- Stats come from the body entry, the same as other bosses. `code:<name>` bodies take theirs from the code:

| Code stat | Body stat | Kept between |
| --- | --- | --- |
| `maxHealth` | ÷ 100 | 0.5 and 20 |
| `bodyDamage` | ÷ 10 | 0.25 and 5 |
| `movementSpeed` | ÷ 50 | 0.25 and 2 |
| `cameraSize` | ÷ 10 | 0.5 and 3 |

### Staff command

`/tankcode` (admin) lists the codes. `/tankcode <code>` turns you into one, and `/tankcode <target> <code>` turns other tanks. A code can be named by the start of its file name or its tank name. Codes can't be pasted into chat: chat commands stop at 2000 characters and codes are around 10000.

### Unknow Remaster boss

`/boss unknow` spawns Unknow Remaster (`tankData/codes/unknow-remaster.txt`). It uses the rank 4 boss stats: 150 health, 4 body damage, 0.4 speed, size 2.5.

### Server

Each firing barrel becomes a normal engine barrel held by a small turret object whose place and angle are set every tick, so bullets, drones, traps, recoil and upgrades all go through the usual firing code. Projectile stats are converted like this:

| Code field | Engine field |
| --- | --- |
| `reload` (seconds) | `reload` × 2 |
| `offset` | `delay` |
| `bulletSpeed` | `speed` ÷ 5 |
| `bulletDamage` | `damage` |
| `bulletHealth` | projectile health × 20 |
| `bulletTime` (seconds) | lifetime in seconds |
| `bulletSpray` (radians) | `spread` |
| `w` × section scale × `bulletSize` | projectile radius in tank radii |

Barrels under an `auto` section fire only while it has a target. The others fire when the tank fires. `auto` sections look for the nearest enemy tank every 5 ticks. Auras hit enemy tanks inside the ring, and `auraHealthSteal` heals the tank by that share of the damage.

Constant and auto sections with firing barrels or damaging auras under them are synced to the client through the turret angle list, so projectiles leave the barrels where they are drawn. The client keeps its own spin and eases toward the server's angle. Other sections are only drawn and are not synced.

A code tank's view range covers its whole drawing, so it doesn't pop in at the screen edge.

## Tests

Run them with `npm test`.
