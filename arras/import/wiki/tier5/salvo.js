const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.twin, g.gunner, g.machineGunner])

Class.salvo = {
    PARENT: "genericTank",
    LABEL: "Salvo",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: -3, Y: 5, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, Y: 2.5, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.2 }),
        ...weaponMirror({
            POSITION: { LENGTH: 20, WIDTH: 2, Y: -2.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 1.3, maxSpeed: 1.3 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["machineGunner", "rimfire"], "salvo")
