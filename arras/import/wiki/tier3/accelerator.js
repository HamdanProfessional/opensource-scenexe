const { base } = require("../constants.js")

Class.accelerator = {
    PARENT: "genericSmasher",
    LABEL: "Accelerator",
    BODY: {
        ACCELERATION: base.ACCEL * 1.5,
        SPEED: base.SPEED * 1.25
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 13 }
        }
    ]
}

upgrade(["smasher"], "accelerator")
