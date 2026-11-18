const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.jerker = {
    PARENT: "genericTank",
    LABEL: "Jerker",
    DANGER: 8,
    BODY: {
        HEALTH: base.HEALTH * 0.8,
        SHIELD: base.SHIELD * 0.8,
        DENSITY: base.DENSITY * 0.6,
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...dereference(Class.bentMinigun).GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
            PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
        }),
        {
            POSITION: { LENGTH: 18, WIDTH: 8, ANGLE: 180, DELAY: 0.35 },
            PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
        }
    ]
}

upgrade(["bentMinigun", "defect", "taser"], "jerker")
