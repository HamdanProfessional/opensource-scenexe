const { combineStats, makeOver, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }])

const front = {
    PARENT: "genericTank",
    LABEL: "Gunner",
    DANGER: 7,
    BODY: Class.overseer.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 2, Y: -2.5 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        }
    ]
}

Class.despotAR = {
    ...makeOver(front, "Despot", { count: 4, maxDrones: 2 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["overgunner", "overlord"], "despotAR")
