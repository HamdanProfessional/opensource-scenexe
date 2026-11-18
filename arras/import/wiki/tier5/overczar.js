const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.overczar = {
    PARENT: "overlord",
    LABEL: "Overczar",
    DANGER: 8,
    MAX_CHILDREN: 12,
    GUNS: weaponArray({
        POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "drone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true
        }
    }, 6)
}

upgrade(["overlord"], "overczar")
