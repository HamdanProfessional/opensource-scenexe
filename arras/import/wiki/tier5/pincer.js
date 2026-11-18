const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { speed: 1.3, maxSpeed: 1.3, range: 1.2 }])

Class.pincer = {
    PARENT: "genericTank",
    LABEL: "Pincer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.35,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 24, WIDTH: 3, Y: -2.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([nail, { size: 2 / 3 }]), TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 28, WIDTH: 2 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 7, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun"], "pincer")
