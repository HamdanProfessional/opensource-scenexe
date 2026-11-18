const { dereference } = require("../facilitators.js")
const { statnames } = require("../constants.js")

Class.yard = {
    PARENT: "genericTank",
    LABEL: "Yard",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: dereference(Class.waarrk).GUNS.map(gun => gun.PROPERTIES ? {
        ...gun,
        PROPERTIES: { ...gun.PROPERTIES, TYPE: "autoTrap" }
    } : gun)
}

upgrade(["waarrk", "cog"], "yard")
