const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaPredator = {
    PARENT: "genericTank",
    LABEL: "Mega Predator",
    DANGER: 8,
    BODY: Class.predator.BODY,
    CONTROLLERS: Class.predator.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: Class.predator.GUNS.map(gun => ({
        ...gun,
        POSITION: { ...gun.POSITION, WIDTH: gun.POSITION.WIDTH * 1.4 },
        PROPERTIES: {
            ...gun.PROPERTIES,
            SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.pounder, { speed: 0.9, maxSpeed: 0.9 }])
        }
    }))
}
upgrade(["predator", "megaHunter"], "megaPredator")
