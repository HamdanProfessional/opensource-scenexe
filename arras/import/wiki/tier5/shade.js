const { combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.shade = {
    PARENT: "genericTank",
    LABEL: "Shade",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    HAS_NO_RECOIL: Class.banshee.HAS_NO_RECOIL,
    FACING_TYPE: Class.banshee.FACING_TYPE,
    BODY: Class.banshee.BODY,
    TURRETS: Class.banshee.TURRETS,
    GUNS: Class.banshee.GUNS.map(gun => ({
        POSITION: gun.POSITION,
        PROPERTIES: {
            ...gun.PROPERTIES,
            SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.doper, { speed: 1.2, maxSpeed: 1.2 }])
        }
    }))
}
upgrade(["banshee", "dopeseer"], "shade")
