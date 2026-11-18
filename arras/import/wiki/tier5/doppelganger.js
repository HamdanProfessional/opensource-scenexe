const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.doppelganger = {
    PARENT: "genericTank",
    LABEL: "Doppelganger",
    DANGER: 8,
    STAT_NAMES: Class.foreman.STAT_NAMES,
    BODY: Class.foreman.BODY,
    MAX_CHILDREN: 5,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 15, ASPECT: 1.3, X: 2, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, { size: 0.95 }, { speed: 1.25, maxSpeed: 1.25 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        })
    ]
}

upgrade(["foreman"], "doppelganger")
