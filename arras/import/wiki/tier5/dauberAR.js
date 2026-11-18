const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.dauberAR = {
    PARENT: "genericTank",
    LABEL: "Dauber",
    DANGER: 8,
    GUNS: [
        ...dereference(Class.spreadshot).GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 11.5, WIDTH: 4, Y: 0.6, ANGLE: 86.5, DELAY: 0.9 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        })
    ]
}

upgrade(["spreadshot"], "dauberAR")
