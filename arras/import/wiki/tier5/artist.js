const { combineStats, weaponArray, weaponMirror, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.artistGun = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 5, Y: -5, ANGLE: -7, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]), TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 18, WIDTH: 14 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 14, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}, { canRepel: true, forceOverride: true, fov: 3 })

Class.artist = {
    PARENT: "genericTank",
    LABEL: "Artist",
    DANGER: 8,
    FACING_TYPE: [
        "spin",
        { speed: 0.02 }
    ],
    GUNS: [],
    TURRETS: [
        ...weaponArray({
            TYPE: "artistGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 12, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["architect"], "artist")
