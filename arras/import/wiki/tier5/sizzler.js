const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.sizzler = {
    PARENT: "genericTank",
    LABEL: "Sizzler",
    STAT_NAMES: statnames.swarm,
    DANGER: 8,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...dereference(Class.bentMinigun).GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 1.5, ANGLE: 22.5, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["bentMinigun", "zipper"], "sizzler")
