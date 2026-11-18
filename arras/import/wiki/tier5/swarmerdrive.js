
const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})

Class.swarmerdriveBee = {
    PARENT: "bee",
    TURRETS: [{
        POSITION: { SIZE: 9, X: 0, Y: 0, ANGLE: 0, ARC: 360, LAYER: 1 },
        TYPE: ["autoTurret", { CONTROLLERS: ["nearestDifferentMaster"], INDEPENDENT: true, COLOR: "grey" }]
    }]
}
Class.swarmerdriveHive = {
    PARENT: "hive",
    GUNS: retype(Class.hive.GUNS, "bee", "swarmerdriveBee")
}

Class.swarmerdrive = {
    PARENT: "genericTank",
    LABEL: "Swarmerdrive",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: retype(Class.swarmer.GUNS, "hive", "swarmerdriveHive")
}

upgrade(["swarmer"], "swarmerdrive")
