const { combineStats } = require("../facilitators.js")

Class.raider = {
    PARENT: "genericTank",
    LABEL: "Raider",
    DANGER: 7,
    BODY: { ...Class.bushwhacker.BODY, ...Class.bomber.BODY },
    GUNS: [
        {
            ...Class.bushwhacker.GUNS[0],
            PROPERTIES: {
                ...Class.bushwhacker.GUNS[0].PROPERTIES,
                SHOOT_SETTINGS: combineStats([Class.bushwhacker.GUNS[0].PROPERTIES.SHOOT_SETTINGS, { speed: 1.15, maxSpeed: 1.15 }])
            }
        },
        Class.bomber.GUNS[1],
        Class.bomber.GUNS[2],
        Class.bushwhacker.GUNS[1],
        Class.bushwhacker.GUNS[2]
    ]
}
upgrade(["bushwhacker", "bomber"], "raider")
