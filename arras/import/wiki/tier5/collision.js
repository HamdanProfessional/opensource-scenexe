const { weaponArray } = require("../facilitators.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const spinCannon = position => ({
    POSITION: { LENGTH: 14, WIDTH: 8, ...position },
    PROPERTIES: Class.spinmissile.GUNS[0].PROPERTIES
})

Class.collisionMissile = {
    PARENT: "spinmissile",
    GUNS: [...Class.spinmissile.GUNS, ...weaponArray(spinCannon({ LENGTH: 11, WIDTH: 10, ANGLE: 90 }), 2)]
}

Class.collision = {
    PARENT: "genericTank",
    LABEL: "Collision",
    DANGER: 8,
    BODY: Class.twister.BODY,
    GUNS: retype(Class.twister.GUNS, "spinmissile", "collisionMissile")
}

upgrade(["twister", "projector"], "collision")
