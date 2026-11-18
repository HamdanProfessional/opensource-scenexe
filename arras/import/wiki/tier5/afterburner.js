const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const smallShot = combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])
const bigShot = combineStats([g.trap, g.machineGun])

Class.afterburner = {
    PARENT: "genericTank",
    LABEL: "Afterburner",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 5.5, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7.5, ASPECT: 1.3, X: 20 },
            PROPERTIES: { SHOOT_SETTINGS: smallShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 12, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 16, ASPECT: 1.3, X: 15 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([bigShot, { reload: 0.75 }]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["frother", "foamer"], "afterburner")
