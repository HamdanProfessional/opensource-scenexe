const { base } = require("../constants.js")

Class.springlock = {
    PARENT: "genericSmasher",
    LABEL: "Springlock",
    BODY: {
        ACCELERATION: base.ACCEL * 1.5,
        SPEED: base.SPEED * 1.2,
        DAMAGE: base.DAMAGE * 1.15
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: ["decagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 14 }
        }
    ]
}

upgrade(["accelerator"], "springlock")
