const { weaponArray } = require("../facilitators.js")

Class.thorn = {
    PARENT: "genericSmasher",
    LABEL: "Thorn",
    BODY: {
        DAMAGE: Class.spike.BODY.DAMAGE * 1.2,
        FOV: Class.megaSmasher.BODY.FOV
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 18 }
        }, 4),
        ...weaponArray({
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 14 }
        }, 4, { startAngle: 45 })
    ]
}

upgrade(["spike"], "thorn")
