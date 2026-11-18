const { combineStats, makeRadialAuto } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.architectGuard = makeRadialAuto("architectGun", {
    isTurret: true,
    danger: 8,
    size: 12,
    label: "Architect Guard",
    body: Class.architect.BODY
})
Class.architectGuard.STAT_NAMES = statnames.mixed
Class.architectGuard.GUNS = [
    {
        POSITION: { LENGTH: 20, WIDTH: 8, ANGLE: 180 },
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]), TYPE: "bullet" }
    }
]
upgrade(["triTrapGuard", "architect"], "architectGuard")
