const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const smallShot = combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])
const bigShot = combineStats([g.trap, g.machineGun])

Class.android = {
    PARENT: "genericTank",
    LABEL: "Android",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 5, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.3, X: 18 },
            PROPERTIES: { SHOOT_SETTINGS: smallShot, TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
            PROPERTIES: { SHOOT_SETTINGS: bigShot, TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["frother"], "android")
