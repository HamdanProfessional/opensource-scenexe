const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const trap = combineStats([g.trap, g.minigun, g.barricade, g.tripleShot])
const sideTrap = combineStats([g.trap, g.minigun, g.barricade, g.tripleShot, { reload: 1.5 }])

Class.bentBarricade = {
    PARENT: "genericTank",
    LABEL: "Bent Barricade",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 21, WIDTH: 8, Y: 3, ANGLE: 16 }
            },
            ...weaponStack({
                POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.3, X: 19, Y: 3, ANGLE: 16, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: sideTrap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }, 3, { xPosOffset: 4, delayIncrement: 1 / 3 })
        ]),
        {
            POSITION: { LENGTH: 24, WIDTH: 8 }
        },
        ...weaponStack({
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.3, X: 22 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }, 3, { xPosOffset: 4, delayIncrement: 1 / 3 })
    ]
}

upgrade(["bentMinigun", "waarrk", "barricade"], "bentBarricade")
