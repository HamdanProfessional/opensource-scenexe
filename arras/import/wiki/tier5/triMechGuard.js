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

Class.triMechGuard = makeGuard(frontGun, "Tri-Mech Guard", { type: "mech", triple: true, danger: 4 })
upgrade(["mechGuard","triTrapGuard","triMech"], "triMechGuard")
