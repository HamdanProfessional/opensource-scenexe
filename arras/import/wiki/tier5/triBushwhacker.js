const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    BODY: { FOV: Class.builder.BODY.FOV },
    GUNS: [
        {
            POSITION: { LENGTH: 22, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { speed: 1.35, maxSpeed: 1.35, range: 1.1 }]),
                TYPE: "bullet"
            }
        }
    ]
}

Class.triBushwhacker = makeGuard(frontGun, "Tri-Bushwhacker", { triple: true, danger: 4 })
upgrade(["triTrapGuard"], "triBushwhacker")
