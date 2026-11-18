const { weaponArray } = require("../facilitators.js")
const { base } = require("../constants.js")

Class.cauldron = {
    PARENT: "genericSmasher",
    LABEL: "Cauldron",
    BODY: {
        DAMAGE: Class.spike.BODY.DAMAGE,
        ACCELERATION: base.ACCEL * 0.5,
        SPEED: base.SPEED * 1.3
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 18 }
        }, 4),
        {
            TYPE: ["squareHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 16 }
        }
    ]
}

upgrade(["spike", "drifter"], "cauldron")
