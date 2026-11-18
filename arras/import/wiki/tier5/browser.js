const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.browser = {
    PARENT: "genericTank",
    LABEL: "Browser",
    DANGER: 8,
    BODY: Class.surfer.BODY,
    GUNS: [
        ...Class.surfer.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 7, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -55, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        })
    ]
}
upgrade(["surfer"], "browser")
