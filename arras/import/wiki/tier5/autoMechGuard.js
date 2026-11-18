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

Class.autoMechGuard = makeAuto(makeGuard(frontGun, "Mech Guard", { type: "mech", danger: 3 }), "Auto-Mech Guard")
upgrade(["mechGuard","autoTrapGuard","autoMech"], "autoMechGuard")
