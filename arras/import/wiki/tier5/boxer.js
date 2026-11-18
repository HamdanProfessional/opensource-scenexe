const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront])
const heavySide = combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { damage: 1.25, health: 1.15, penetration: 1.1 }])
const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.boxer = {
    PARENT: "genericTank",
    LABEL: "Boxer",
    DANGER: 8,
    BODY: Class.fighter.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([front, { recoil: 4 }]), TYPE: "bullet", LABEL: "Front" }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 16, WIDTH: 11, Y: -1, ANGLE: 90 },
                PROPERTIES: { SHOOT_SETTINGS: heavySide, TYPE: "bullet", LABEL: "Side" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
                PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
            }
        ])
    ]
}
upgrade(["fighter"], "boxer")
