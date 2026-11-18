const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }])

Class.arbalest = {
    PARENT: "genericTank",
    LABEL: "Arbalest",
    DANGER: 7,
    BODY: Class.rifle.BODY,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 3, Y: 3, ANGLE: 50, DELAY: 1 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 13, WIDTH: 3, Y: 3.5, ANGLE: 35, DELAY: 0.75 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 15, WIDTH: 3, Y: 4, ANGLE: 20, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            }
        ], { delayOverflow: true }),
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15.5, WIDTH: 7, Y: 6.15 }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 7, Y: 4.15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, { reload: 1.1 }]),
                    TYPE: "bullet"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["musket", "crossbow"], "arbalest")
