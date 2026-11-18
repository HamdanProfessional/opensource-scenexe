const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.brawler = {
    PARENT: "genericTank",
    LABEL: "Brawler",
    DANGER: 8,
    BODY: Class.fighter.BODY,
    GUNS: [
        ...Class.fighter.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 136, DELAY: 0.6 },
            PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
        })
    ]
}
upgrade(["fighter", "booster"], "brawler")
