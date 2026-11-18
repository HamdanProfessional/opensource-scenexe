const { weaponArray } = require("../facilitators.js")

Class.phantom = {
    PARENT: "genericTank",
    LABEL: "Phantom",
    DANGER: 9,
    BODY: { ...Class.banshee.BODY, FOV: Class.sniper3.BODY.FOV },
    TURRETS: weaponArray({
        TYPE: "sniper3gun",
        POSITION: { SIZE: 14, X: 8, ANGLE: 0, ARC: 80, LAYER: 0 }
    }, 3),
    GUNS: weaponArray([
        {
            POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 1, WIDTH: 12, X: 15, ANGLE: 180 },
            PROPERTIES: {
                ...Class.captain.GUNS[1].PROPERTIES,
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: { LENGTH: 11.5, WIDTH: 12, ANGLE: 180 }
        }
    ], 3)
}
upgrade(["sniper3", "banshee", "captain"], "phantom")
