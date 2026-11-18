const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.roller = {
    PARENT: "genericTank",
    LABEL: "Roller",
    DANGER: 8,
    BODY: Class.surfer.BODY,
    GUNS: [
        Class.surfer.GUNS[0],
        ...weaponMirror({
            POSITION: { LENGTH: 7, WIDTH: 9, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                TYPE: ["tinyMinion", { INDEPENDENT: true }],
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true
            }
        }),
        ...Class.surfer.GUNS.slice(3)
    ]
}
upgrade(["surfer"], "roller")
