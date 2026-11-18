const { combineStats, weaponArray } = require("../facilitators.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const spinCannon = position => ({
    POSITION: { LENGTH: 14, WIDTH: 8, ...position },
    PROPERTIES: Class.spinmissile.GUNS[0].PROPERTIES
})

Class.catapultMissile = {
    PARENT: "spinmissile",
    GUNS: weaponArray(spinCannon({ WIDTH: 11 }), 2, { delayIncrement: 0.5 }).map(gun => ({
        ...gun,
        PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { size: 1.5, damage: 1.2 }]) }
    }))
}

Class.catapult = {
    PARENT: "genericTank",
    LABEL: "Catapult",
    DANGER: 8,
    BODY: Class.twister.BODY,
    GUNS: retype(Class.twister.GUNS, "spinmissile", "catapultMissile")
}

upgrade(["hurler", "twister"], "catapult")
