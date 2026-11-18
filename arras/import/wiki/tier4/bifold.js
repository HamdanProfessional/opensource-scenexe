const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.sniper, g.rifle, g.twin, g.dual, { reload: 1.15 }])

Class.bifold = {
    PARENT: "genericTank",
    LABEL: "Bifold",
    DANGER: 7,
    BODY: Class.hunter.BODY,
    CONTROLLERS: Class.hunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 17, WIDTH: 7, Y: 3.5 }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 5.5, Y: 3.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 7, Y: 8.5 }
        },
        {
            POSITION: { LENGTH: 22, WIDTH: 5.5, Y: 8.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["dual", "musket", "prober"], "bifold")
