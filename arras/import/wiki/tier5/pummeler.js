const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2 }, { reload: 0.85 }])

Class.pummeler = {
    PARENT: "genericTank",
    LABEL: "Pummeler",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 5, Y: 7.25, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 5, Y: 3.75, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.2 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ]
}

upgrade(["battery", "volley"], "pummeler")
