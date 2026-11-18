const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.crankTurret = {
    PARENT: "genericTank",
    LABEL: "",
    COLOR: 16,
    INDEPENDENT: true,
    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
    BODY: { FOV: 1 },
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.autoTurret, { recoil: 0 }]),
                TYPE: "bullet"
            }
        }
    ]
}

Class.crank = {
    PARENT: "genericTank",
    LABEL: "Crank",
    DANGER: 8,
    BODY: Class.crowbar.BODY,
    GUNS: Class.crowbar.GUNS,
    TURRETS: [18, 29, 40].map(x => ({
        TYPE: "crankTurret",
        POSITION: { SIZE: 8, X: x, ARC: 180, LAYER: 1 }
    }))
}
upgrade(["mega3", "crowbar"], "crank")
