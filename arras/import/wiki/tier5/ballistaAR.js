const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const spread = dereference(Class.spreadshot).GUNS.slice(0, -1)
const pellet = combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot])

Class.ballistaAR = {
    PARENT: "genericTank",
    LABEL: "Ballista",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...spread,
        ...weaponMirror([
            {
                POSITION: { LENGTH: 10, WIDTH: 4, Y: 1, ANGLE: 100, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet", LABEL: "Spread" }
            },
            {
                POSITION: { LENGTH: 11, WIDTH: 4, Y: 1, ANGLE: 115, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet", LABEL: "Spread" }
            }
        ]),
        {
            POSITION: { LENGTH: 26, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot, g.sniper]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["spreadshot", "crossbow"], "ballistaAR")
