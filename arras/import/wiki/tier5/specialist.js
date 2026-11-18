const { combineStats, weaponMirror, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.specialistTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 7, WIDTH: 6, ASPECT: 1.4, X: 6, Y: 4, ANGLE: 20 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.carrier]),
                TYPE: "drone",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }, { delayIncrement: 0.5 })
    ]
}, { independent: true, extraStats: [] })

Class.specialistPillbox = {
    PARENT: "pillbox",
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "specialistTurret"
        }
    ]
}

Class.specialist = {
    PARENT: "genericTank",
    LABEL: "Specialist",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 5, WIDTH: 11, X: 10.5 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 14, X: 15.5 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 14, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "specialistPillbox",
                STAT_CALCULATOR: "block",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 14 }
        }
    ]
}

upgrade(["engineer"], "specialist")
