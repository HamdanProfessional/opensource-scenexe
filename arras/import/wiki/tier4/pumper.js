
let converted = 0

Class.pumper = {
    PARENT: "genericTank",
    LABEL: "Pumper",
    DANGER: 7,
    BODY: Class.shotgun.BODY,
    GUNS: Class.shotgun.GUNS.map(gun => {
        if (gun.PROPERTIES && gun.PROPERTIES.TYPE === "bullet" && converted < 4) {
            converted++
            return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: "minimissile", STAT_CALCULATOR: "sustained" } }
        }
        return gun
    })
}

upgrade(["shotgun"], "pumper")
