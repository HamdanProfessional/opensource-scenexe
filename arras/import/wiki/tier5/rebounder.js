const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.rebounder = {
    PARENT: "genericTank",
    LABEL: "Rebounder",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 5, Y: -5, ANGLE: -7, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]), TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 18, WIDTH: 10 }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 10, ASPECT: -1.9 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["boomer", "forger"], "rebounder")
