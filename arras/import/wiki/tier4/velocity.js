const { base } = require("../constants.js")

Class.velocity = {
    PARENT: "genericSmasher",
    LABEL: "Velocity",
    BODY: {
        ACCELERATION: base.ACCEL * 1.8,
        SPEED: base.SPEED * 1.45,
        FOV: base.FOV * 1.1
    },
    TURRETS: [
        {
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 21.5, ANGLE: 60 }
        }
    ]
}

upgrade(["accelerator"], "velocity")
