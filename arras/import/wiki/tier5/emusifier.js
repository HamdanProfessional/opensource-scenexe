const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const mainShot = combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])
const dieselShot = combineStats([g.basic, g.machineGun, g.diesel])

Class.emusifier = {
    PARENT: "genericTank",
    LABEL: "Emusifier",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 25, WIDTH: 9 },
            PROPERTIES: { SHOOT_SETTINGS: mainShot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 16, ASPECT: 1.6, X: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([dieselShot, { reload: 0.8 }]), TYPE: "bullet" }
        }
    ]
}

upgrade(["foamer"], "emusifier")
