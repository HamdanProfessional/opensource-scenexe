const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const smallShot = combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])
const bigShot = combineStats([g.trap, g.machineGun])
const smallTrap = [
    {
        POSITION: { LENGTH: 18, WIDTH: 5, ASPECT: 1.4 }
    },
    {
        POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.3, X: 18 },
        PROPERTIES: { SHOOT_SETTINGS: smallShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
    }
]
const bigTrap = [
    {
        POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
    },
    {
        POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
        PROPERTIES: { SHOOT_SETTINGS: bigShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
    }
]

Class.whisker = {
    PARENT: "genericTank",
    LABEL: "Whisker",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 7 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 7, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { size: 0.8 }]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        },
        ...bigTrap
    ]
}

upgrade(["frother"], "whisker")
