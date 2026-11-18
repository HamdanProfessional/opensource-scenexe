const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.spanner = {
    PARENT: "genericTank",
    LABEL: "Spanner",
    DANGER: 8,
    BODY: Class.crowbar.BODY,
    TURRETS: Class.crowbar.TURRETS,
    GUNS: [
        ...Class.crowbar.GUNS,
        {
            POSITION: { LENGTH: 12, WIDTH: 9, X: 33 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["crowbar"], "spanner")
