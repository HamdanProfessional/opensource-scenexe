
const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const straighten = guns => guns.map(gun => ({ ...gun, POSITION: { ...posObject(gun.POSITION), ANGLE: 0 } }))

Class.howitzer = {
    PARENT: "genericTank",
    LABEL: "Howitzer",
    DANGER: 8,
    BODY: Class.fieldGun.BODY,
    GUNS: straighten(Class.fieldGun.GUNS)
}

upgrade(["fieldGun", "foctillery"], "howitzer")
