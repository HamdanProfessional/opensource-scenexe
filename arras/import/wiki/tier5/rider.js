const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.rider = {
    PARENT: "genericTank",
    LABEL: "Rider",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.bomber.BODY,
    GUNS: [
        ...Class.bomber.GUNS,
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
upgrade(["bomber", "surfer"], "rider")
