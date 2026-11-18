const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }])
const tiny = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15, size: 0.8 }])
const heavy = combineStats([g.basic, g.machineGun])

const sharp = combineStats([pellet, { spray: 0.7 }])

Class.refocuser = {
    PARENT: "genericTank",
    LABEL: "Refocuser",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 29, WIDTH: 3.5, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([tiny, { spray: 0.7 }]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 5.5, DELAY: 2 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: sharp, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 23, WIDTH: 8, DELAY: 1 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: sharp, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 10, ASPECT: 1.4, X: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([heavy, { spray: 0.7 }]), TYPE: "bullet" }
        }
    ]
}

upgrade(["redistributor", "focal"], "refocuser")
