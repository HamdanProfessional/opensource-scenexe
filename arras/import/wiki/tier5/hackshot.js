const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.hackshot = {
    PARENT: "genericTank",
    LABEL: "Hackshot",
    DANGER: 8,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...dereference(Class.bentMinigun).GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 20, WIDTH: 3.5, Y: 0.5, ANGLE: 8, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.tripleShot, { size: 4 / 3 }]),
                TYPE: "bullet"
            }
        })
    ]
}

upgrade(["splitShot", "bentMinigun"], "hackshot")
