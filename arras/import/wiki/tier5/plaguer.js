const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.plaguer = {
    PARENT: "genericTank",
    LABEL: "Plaguer",
    DANGER: 8,
    NECRO: [0],
    SIZE: 11.5,
    STAT_NAMES: Class.infestor.STAT_NAMES,
    BODY: Class.infestor.BODY,
    GUNS: [
        ...weaponArray(weaponMirror({
            POSITION: { LENGTH: 10, WIDTH: 6, ASPECT: 1.2, X: 3, Y: 5, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, { reload: 0.5 }]),
                TYPE: "eggchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 8
            }
        }), 2),
        ...weaponMirror({
            POSITION: { LENGTH: 10, WIDTH: 6, ASPECT: 1.2, X: 3, Y: 5, ANGLE: 45 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, { reload: 0.5 }]),
                TYPE: ["eggchip", { INDEPENDENT: true }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 4
            }
        })
    ]
}

upgrade(["necromancer", "infestor"], "plaguer")
