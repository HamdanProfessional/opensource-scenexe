const { combineStats } = require("../facilitators.js")

Class.presage = {
    PARENT: "genericTank",
    LABEL: "Presage",
    DANGER: 8,
    BODY: Class.predator.BODY,
    CONTROLLERS: Class.predator.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 12 }
        },
        ...Class.predator.GUNS.map(gun => ({
            ...gun,
            POSITION: { ...gun.POSITION, LENGTH: gun.POSITION.LENGTH + 3, WIDTH: gun.POSITION.WIDTH * 0.65 },
            PROPERTIES: {
                ...gun.PROPERTIES,
                SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { speed: 1.2, maxSpeed: 1.2, damage: 1.15 }])
            }
        }))
    ]
}
upgrade(["predator", "prober"], "presage")
