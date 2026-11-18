const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const boomerangShot = combineStats([g.trap, g.setTrap, g.boomerang])
const backCannon = (shot, width, length = 20.5) => ({
    POSITION: { LENGTH: length, WIDTH: width, ANGLE: 180 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})

Class.defeater = {
    PARENT: "genericTank",
    LABEL: "Defeater",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        backCannon(destroyerShot, 14),
        { POSITION: { LENGTH: 18, WIDTH: 10 } },
        { POSITION: { LENGTH: 13, WIDTH: 10, ASPECT: -1.9 } },
        {
            POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.3, X: 18 },
            PROPERTIES: { SHOOT_SETTINGS: boomerangShot, TYPE: "boomerang", STAT_CALCULATOR: "block" }
        }
    ]
}

upgrade(["conqueror", "boomer"], "defeater")
