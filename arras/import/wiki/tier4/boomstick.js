const { combineStats } = require("../facilitators.js")

const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)

Class.boomstick = {
    PARENT: "genericTank",
    LABEL: "Boomstick",
    DANGER: 7,
    BODY: Class.shotgun.BODY,
    GUNS: modAll(Class.shotgun.GUNS, { damage: 1.4, reload: 1.1 })
}

upgrade(["shotgun"], "boomstick")
