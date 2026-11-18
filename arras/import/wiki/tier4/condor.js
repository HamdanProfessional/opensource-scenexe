const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.condor = {
    PARENT: "genericTank",
    LABEL: "Condor",
    DANGER: 8,
    BODY: Class.surfer.BODY,
    GUNS: [
        ...Class.eagle.GUNS,
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
upgrade(["surfer", "eagle"], "condor")
