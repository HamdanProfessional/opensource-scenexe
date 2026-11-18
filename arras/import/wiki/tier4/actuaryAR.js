const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.actuaryAR = {
    PARENT: "genericHealer",
    LABEL: "Actuary",
    BODY: Class.minigun.BODY,
    GUNS: weaponStack([
        {
            POSITION: { LENGTH: 18, WIDTH: 7, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.minigun]),
                TYPE: "healerBullet"
            }
        }
    ], 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
}

upgrade(["medicAR", "psychiatristAR"], "actuaryAR")
