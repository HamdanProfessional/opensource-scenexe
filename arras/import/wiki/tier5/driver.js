const { combineStats, weaponMirror, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.driverTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 22, WIDTH: 7, Y: 4.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            }
        }, { delayIncrement: 0.5 })
    ]
}, { independent: true, extraStats: [] })

Class.driverPillbox = {
    PARENT: "pillbox",
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "driverTurret"
        }
    ]
}

Class.driver = {
    PARENT: "genericTank",
    LABEL: "Driver",
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
                TYPE: "driverPillbox",
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

upgrade(["engineer"], "driver")
