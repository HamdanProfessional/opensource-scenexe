const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const sprayed = dereference(Class.waarrk).GUNS.map(gun => gun.PROPERTIES ? {
    ...gun,
    PROPERTIES: {
        ...gun.PROPERTIES,
        SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { reload: 0.75, spray: 1.5 }])
    }
} : gun)

Class.spitter = {
    PARENT: "genericTank",
    LABEL: "Spitter",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...sprayed,
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 6, ASPECT: 1.3, Y: 8.5, ANGLE: 4 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.3, X: 14, Y: 8.5, ANGLE: 4, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot, { reload: 0.75, spray: 1.5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ])
    ]
}

upgrade(["waarrk", "expeller"], "spitter")
