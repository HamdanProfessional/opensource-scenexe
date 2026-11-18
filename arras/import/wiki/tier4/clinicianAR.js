const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.clinicianAR = {
    PARENT: "genericHealer",
    LABEL: "Clinician",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: { LENGTH: 11, WIDTH: 8, ASPECT: -0.4, X: 9.5, Y: 5.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 9, Y: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], { delayIncrement: 0.5 }), 2)
}

upgrade(["nurseAR"], "clinicianAR")
