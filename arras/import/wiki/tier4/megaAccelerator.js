const { base } = require("../constants.js")

Class.megaAccelerator = {
    PARENT: "genericSmasher",
    LABEL: "Mega-Accelerator",
    SIZE: Class.genericTank.SIZE * 1.3,
    BODY: {
        ...Class.megaSmasher.BODY,
        ACCELERATION: base.ACCEL * 1.5,
        PUSHABILITY: 0.5
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 26 }
        },
        {
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 15 }
        }
    ]
}

upgrade(["accelerator"], "megaAccelerator")
