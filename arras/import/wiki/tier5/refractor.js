const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }])
const tiny = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15, size: 0.8 }])
const heavy = combineStats([g.basic, g.machineGun])

Class.refractor = {
    PARENT: "genericTank",
    LABEL: "Refractor",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 29, WIDTH: 4, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: tiny, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 7, DELAY: 2 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 23, WIDTH: 10, DELAY: 1 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 13, ASPECT: 1.6, X: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel]), TYPE: "bullet" }
        }
    ]
}

upgrade(["redistributor", "foamer"], "refractor")
