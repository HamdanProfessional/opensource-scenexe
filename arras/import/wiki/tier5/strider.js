const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.strider = {
    PARENT: "genericTank",
    LABEL: "Strider",
    DANGER: 8,
    BODY: Class.fighter.BODY,
    GUNS: [
        ...Class.fighter.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 7, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -125 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        })
    ]
}
upgrade(["fighter", "surfer"], "strider")
