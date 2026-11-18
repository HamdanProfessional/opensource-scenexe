const { weaponArray } = require("../facilitators.js")
const { base } = require("../constants.js")

Class.mosquito = {
    PARENT: "genericSmasher",
    LABEL: "Mosquito",
    SIZE: Class.bonker.SIZE * 0.9,
    BODY: {
        ACCELERATION: base.ACCEL * 1.8,
        SPEED: base.SPEED * 1.5,
        FOV: base.FOV * 1.15
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 16 }
        }, 3)
    ]
}

upgrade(["accelerator"], "mosquito")
