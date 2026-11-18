const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const constructShot = combineStats([g.trap, g.setTrap, g.construct])

Class.compilator = {
    PARENT: "genericTank",
    LABEL: "Compilator",
    DANGER: 7,
    BODY: Class.construct.BODY,
    GUNS: [
        { POSITION: { LENGTH: 18, WIDTH: 22 } },
        {
            POSITION: { LENGTH: 2, WIDTH: 22, ASPECT: 1.2, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([constructShot, { size: 1.3, health: 1.3, damage: 1.3, reload: 1.4 }]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["annihilator", "construct", "megaTrapper"], "compilator")
