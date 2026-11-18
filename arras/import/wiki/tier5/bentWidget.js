const { dereference, combineStats } = require("../facilitators.js")
const { base } = require("../constants.js")

const sprayed = dereference(Class.bentMinigun).GUNS.map(gun => ({
    ...gun,
    POSITION: { ...gun.POSITION, ASPECT: 1.4 },
    PROPERTIES: {
        ...gun.PROPERTIES,
        SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { reload: 0.85, spray: 2 }])
    }
}))

Class.bentWidget = {
    PARENT: "genericTank",
    LABEL: "Bent Widget",
    DANGER: 8,
    BODY: {
        ...Class.minigun.BODY,
        FOV: base.FOV * 1.25
    },
    GUNS: sprayed
}

upgrade(["bentMinigun", "widget"], "bentWidget")
