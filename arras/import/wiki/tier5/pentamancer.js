const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.pentamancer = {
    PARENT: "genericTank",
    LABEL: "Pentamancer",
    DANGER: 8,
    NECRO: [5],
    SHAPE: 5,
    SIZE: 11.5,
    STAT_NAMES: Class.pentaseer.STAT_NAMES,
    MAX_CHILDREN: 20,
    BODY: Class.pentaseer.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 7.4, ANGLE: 36 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, { reload: 0.8, size: 1.5, health: 2 }]),
                TYPE: "pentachip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false
            }
        }, 5, { delayIncrement: 0.5 })
    ]
}

upgrade(["necromancer", "pentaseer"], "pentamancer")
