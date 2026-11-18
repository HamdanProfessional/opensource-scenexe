const { combineStats, makeOver, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const front = {
    PARENT: "genericTank",
    LABEL: "Harbinger",
    DANGER: 7,
    BODY: Class.overseer.BODY,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 19, WIDTH: 2, Y: -2.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 6, Y: 6.5, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 2 / 3 }]),
                    TYPE: "bullet"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        }
    ]
}

Class.harbingerAR = {
    ...makeOver(front, "Harbinger", { maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["overgunner", "rimfire"], "harbingerAR")
