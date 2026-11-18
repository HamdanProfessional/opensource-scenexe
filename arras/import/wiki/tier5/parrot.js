const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const swarm = combineStats([g.swarm])
const front = combineStats([g.basic, g.pen, g.flankGuard, g.triAngle, g.triAngleFront])
const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.parrot = {
    PARENT: "genericTank",
    LABEL: "Parrot",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.surfer.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet", LABEL: "Front" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 7, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: swarm,
                    TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm"
                }
            },
            {
                POSITION: { LENGTH: 7, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -55, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: swarm,
                    TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm"
                }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
                PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
            }
        ])
    ]
}
upgrade(["surfer", "cockatiel"], "parrot")
