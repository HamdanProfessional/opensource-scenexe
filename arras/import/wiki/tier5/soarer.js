const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.soarer = {
    PARENT: "genericTank",
    LABEL: "Soarer",
    DANGER: 8,
    BODY: Class.booster.BODY,
    GUNS: [
        ...Class.booster.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 7, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        })
    ]
}
upgrade(["booster", "surfer"], "soarer")
