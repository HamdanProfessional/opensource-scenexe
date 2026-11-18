const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" }
        }
    ]
}

Class.triMachineGuard = makeGuard(frontGun, "Tri-Machine Guard", { type: "machineTrapper", triple: true, danger: 4 })
upgrade(["machineGuard","triTrapGuard","triMachine"], "triMachineGuard")
