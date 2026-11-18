const { combineStats, weaponArray } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.revenant = {
    PARENT: "genericTank",
    LABEL: "Revenant",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    HAS_NO_RECOIL: Class.banshee.HAS_NO_RECOIL,
    FACING_TYPE: Class.banshee.FACING_TYPE,
    BODY: Class.banshee.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 3, { delayIncrement: 1 / 3 }),
        ...Class.banshee.GUNS
    ],
    TURRETS: [
        ...Class.banshee.TURRETS,
        ...weaponArray({
            TYPE: "sniperTurret",
            POSITION: { SIZE: 7, X: 15, ANGLE: 60, ARC: 90, LAYER: 1 }
        }, 3)
    ]
}
upgrade(["banshee", "commander"], "revenant")
