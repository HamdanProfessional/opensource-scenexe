const { combineStats } = require("../facilitators.js")

Class.anchor = {
    PARENT: "genericTank",
    LABEL: "Anchor",
    DANGER: 7,
    BODY: { ...Class.bushwhacker.BODY, FOV: Class.bushwhacker.BODY.FOV * 1.08 },
    GUNS: [
        {
            ...Class.bushwhacker.GUNS[0],
            PROPERTIES: {
                ...Class.bushwhacker.GUNS[0].PROPERTIES,
                SHOOT_SETTINGS: combineStats([Class.bushwhacker.GUNS[0].PROPERTIES.SHOOT_SETTINGS, { speed: 1.15, maxSpeed: 1.15 }])
            }
        },
        Class.bushwhacker.GUNS[1],
        {
            ...Class.bushwhacker.GUNS[2],
            PROPERTIES: {
                ...Class.bushwhacker.GUNS[2].PROPERTIES,
                SHOOT_SETTINGS: combineStats([Class.bushwhacker.GUNS[2].PROPERTIES.SHOOT_SETTINGS, { reload: 0.7 }])
            }
        }
    ]
}
upgrade(["bushwhacker", "machineGuard"], "anchor")
