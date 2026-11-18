const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const mainShot = combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])
const dieselShot = combineStats([g.basic, g.machineGun, g.diesel])

Class.junkyard = {
    PARENT: "genericTank",
    LABEL: "Junkyard",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 25, WIDTH: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([mainShot, { reload: 0.8 }]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 12, ASPECT: 1.6, X: 8 },
            PROPERTIES: { SHOOT_SETTINGS: dieselShot, TYPE: "bullet" }
        }
    ]
}

upgrade(["foamer"], "junkyard")
