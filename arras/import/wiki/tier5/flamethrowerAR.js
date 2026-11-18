const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }])
const tiny = combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15, size: 0.8 }])
const heavy = combineStats([g.basic, g.machineGun])

Class.flamethrowerAR = {
    PARENT: "genericTank",
    LABEL: "Flamethrower",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 29, WIDTH: 4, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([tiny, g.machineGun, { reload: 1.4, damage: 1.5 }]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 7, DELAY: 2 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([pellet, { reload: 0.7, spray: 1.5, damage: 1.2 }]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 23, WIDTH: 10, DELAY: 1 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([pellet, { reload: 0.7, spray: 1.5, damage: 1.2 }]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 10, ASPECT: 1.4, X: 8 },
            PROPERTIES: { SHOOT_SETTINGS: heavy, TYPE: "bullet" }
        }
    ]
}

upgrade(["redistributor", "atomizer"], "flamethrowerAR")
