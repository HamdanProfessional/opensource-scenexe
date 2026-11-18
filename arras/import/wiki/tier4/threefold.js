const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const big = combineStats([g.basic, g.sniper, g.hunter, g.tripleShot])
const small = combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.tripleShot])

Class.threefold = {
    PARENT: "genericTank",
    LABEL: "Threefold",
    DANGER: 7,
    BODY: Class.hunter.BODY,
    CONTROLLERS: Class.hunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 21, WIDTH: 5, Y: 6.5, ANGLE: 10, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: small, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 7, Y: 6.5, ANGLE: 10, DELAY: 0.75 },
                PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "bullet" }
            }
        ]),
        {
            POSITION: { LENGTH: 24, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: small, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 21, WIDTH: 11, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "bullet" }
        }
    ]
}

upgrade(["tripleShot", "dual"], "threefold")
