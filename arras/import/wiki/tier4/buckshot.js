const { combineStats, weaponMirror } = require("../facilitators.js")

const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)

Class.buckshot = {
    PARENT: "genericTank",
    LABEL: "Buckshot",
    DANGER: 7,
    BODY: Class.shotgun.BODY,
    GUNS: [
        ...modAll(Class.shotgun.GUNS, { size: 0.75, damage: 0.85 }),
        ...weaponMirror({
            POSITION: { LENGTH: 1, WIDTH: 2.5, X: 14, Y: 4.5 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([Class.shotgun.GUNS[0].PROPERTIES.SHOOT_SETTINGS, { size: 0.75, damage: 0.85 }]), TYPE: "bullet" }
        }),
        ...weaponMirror({
            POSITION: { LENGTH: 1, WIDTH: 2.5, X: 15, Y: 6 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([Class.shotgun.GUNS[0].PROPERTIES.SHOOT_SETTINGS, { size: 0.75, damage: 0.85 }]), TYPE: "bullet" }
        }),
        ...weaponMirror({
            POSITION: { LENGTH: 1, WIDTH: 2.5, X: 16, Y: 7.5 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([Class.shotgun.GUNS[0].PROPERTIES.SHOOT_SETTINGS, { size: 0.75, damage: 0.85 }]), TYPE: "bullet" }
        })
    ]
}

upgrade(["shotgun"], "buckshot")
