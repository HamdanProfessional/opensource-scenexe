const { combineStats } = require("../facilitators.js")

Class.flicher = {
    PARENT: "genericTank",
    LABEL: "Flicher",
    DANGER: 8,
    BODY: { ...Class.prober.BODY, FOV: Class.prober.BODY.FOV * 1.05 },
    CONTROLLERS: Class.prober.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: Class.prober.GUNS.map(gun => {
        if (!gun.PROPERTIES || !gun.PROPERTIES.SHOOT_SETTINGS) return gun
        return {
            ...gun,
            PROPERTIES: {
                ...gun.PROPERTIES,
                SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { reload: 0.85, size: 0.85, speed: 1.15, maxSpeed: 1.15 }])
            }
        }
    })
}
upgrade(["enforcer", "courser", "prober"], "flicher")
