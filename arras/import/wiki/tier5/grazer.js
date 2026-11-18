const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const missileDrone = (angle, y) => ({
    POSITION: { LENGTH: 6, WIDTH: 8, ASPECT: 1.2, X: 6, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { size: 0.6, reload: 1.5 }]),
        TYPE: ["drone", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: "drone",
        MAX_CHILDREN: 2,
        WAIT_TO_CYCLE: true
    }
})

Class.grazerMissile = {
    PARENT: "missile",
    GUNS: [...Class.missile.GUNS, missileDrone(90, 0), missileDrone(270, 0)]
}

Class.grazer = {
    PARENT: "genericTank",
    LABEL: "Grazer",
    DANGER: 8,
    BODY: Class.skimmer.BODY,
    GUNS: retype(Class.skimmer.GUNS, "missile", "grazerMissile")
}

upgrade(["skimmer"], "grazer")
