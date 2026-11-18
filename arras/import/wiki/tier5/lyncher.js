const { combineStats } = require("../facilitators.js")

Class.lyncher = {
    PARENT: "genericTank",
    LABEL: "Lyncher",
    DANGER: 8,
    BODY: { ...Class.courser.BODY, FOV: Class.courser.BODY.FOV * 1.05 },
    CONTROLLERS: Class.courser.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...Class.ordnance.GUNS.slice(0, 2),
        ...Class.courser.GUNS.map(gun => {
            if (!gun.PROPERTIES) return gun
            return {
                ...gun,
                PROPERTIES: {
                    ...gun.PROPERTIES,
                    SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { speed: 1.15, maxSpeed: 1.15 }])
                }
            }
        })
    ]
}
upgrade(["courser", "ordnance"], "lyncher")
