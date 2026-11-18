const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.spindrift = {
    PARENT: "genericTank",
    LABEL: "Spindrift",
    DANGER: 8,
    BODY: Class.surfer.BODY,
    GUNS: [
        Class.surfer.GUNS[0],
        ...weaponMirror({
            POSITION: { LENGTH: 8, WIDTH: 11, ASPECT: 0.6, X: 7, Y: 1, ANGLE: -90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 1.6, health: 1.3, damage: 1.2, reload: 1.2 }]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        }),
        ...Class.surfer.GUNS.slice(3)
    ]
}
upgrade(["surfer"], "spindrift")
