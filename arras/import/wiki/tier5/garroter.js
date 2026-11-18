const { combineStats } = require("../facilitators.js")

Class.garroter = {
    PARENT: "genericTank",
    LABEL: "Garroter",
    DANGER: 8,
    BODY: { ...Class.predator.BODY, FOV: Class.predator.BODY.FOV * 1.1 },
    CONTROLLERS: [["zoom", { distance: 450 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...Class.predator.GUNS.map(gun => ({
            ...gun,
            POSITION: { ...gun.POSITION, LENGTH: gun.POSITION.LENGTH + 3 },
            PROPERTIES: {
                ...gun.PROPERTIES,
                SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { speed: 1.2, maxSpeed: 1.2, range: 1.1 }])
            }
        })),
        {
            POSITION: { LENGTH: 13, WIDTH: 11, ASPECT: -1.7 }
        }
    ]
}
upgrade(["courser", "predator"], "garroter")
