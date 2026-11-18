const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.twin, g.gunner, g.healer, { speed: 1.2 }])

Class.therapistAR = {
    PARENT: "genericHealer",
    LABEL: "Therapist",
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 5, WIDTH: 2.5, ASPECT: -0.4, X: 9.5, Y: 7.25 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "healerBullet" }
        },
        {
            POSITION: { LENGTH: 9, WIDTH: 2.5, ASPECT: -0.4, X: 9.5, Y: 3.75 }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "healerBullet" }
        }
    ], { delayIncrement: 0.25 })
}

upgrade(["nurseAR", "psychiatristAR"], "therapistAR")
