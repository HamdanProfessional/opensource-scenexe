const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.pollen = {
    PARENT: "genericTank",
    LABEL: "Pollen",
    DANGER: 8,
    NECRO: [0, 4],
    SIZE: 11.5,
    STAT_NAMES: Class.infestor.STAT_NAMES,
    BODY: Class.infestor.BODY,
    GUNS: [
        ...weaponArray(weaponMirror({
            POSITION: { LENGTH: 10, WIDTH: 6, ASPECT: 1.2, X: 3, Y: 5, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, { reload: 0.5 }]),
                TYPE: ["eggchip", { INDEPENDENT: true }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 10
            }
        }), 2),
        ...weaponMirror({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 7.4, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 6
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["infestor"], "pollen")
