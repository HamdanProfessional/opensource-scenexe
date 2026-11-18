const { weaponArray } = require("../facilitators.js")
const { base } = require("../constants.js")

Class.porcupine = {
    PARENT: "genericSmasher",
    LABEL: "Porcupine",
    BODY: {
        ACCELERATION: base.ACCEL * 1.4,
        SPEED: base.SPEED * 1.2,
        DAMAGE: Class.spike.BODY.DAMAGE
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 16 }
        }, 6),
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 15 }
        }
    ]
}

upgrade(["accelerator"], "porcupine")
