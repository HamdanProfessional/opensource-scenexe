const { combineStats } = require("../facilitators.js")

const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)

Class.culverin = {
    PARENT: "genericTank",
    LABEL: "Culverin",
    DANGER: 7,
    BODY: { ...Class.shotgun.BODY, FOV: Class.shotgun.BODY.FOV * 1.2 },
    GUNS: modAll(Class.shotgun.GUNS, { speed: 1.3, maxSpeed: 1.2, range: 1.1 })
}

upgrade(["shotgun"], "culverin")
