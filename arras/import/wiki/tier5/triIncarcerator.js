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

Class.triIncarcerator = makeGuard(frontGun, "Tri-Incarcerator", { type: "pen", triple: true, danger: 4 })
upgrade(["incarcerator","triTrapGuard","triPen"], "triIncarcerator")
