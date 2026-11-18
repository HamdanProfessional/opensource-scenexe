const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.65, spray: 4, shudder: 1.5 }]),
                TYPE: "bullet"
            }
        }
    ]
}

Class.scout = makeGuard(frontGun, "Scout", { type: "machineTrapper", danger: 4 })
upgrade(["machineGuard"], "scout")
