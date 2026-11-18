const { base } = require("../constants.js")

Class.wreckingBall = {
    PARENT: "genericSmasher",
    LABEL: "Wrecking Ball",
    SIZE: Class.genericTank.SIZE * 1.6,
    BODY: {
        ...Class.megaSmasher.BODY,
        DENSITY: Class.megaSmasher.BODY.DENSITY * 2,
        ACCELERATION: base.ACCEL * 1.4,
        SPEED: base.SPEED * 0.95
    },
    TURRETS: [
        {
            TYPE: ["octagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 30 }
        },
        {
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
            POSITION: { SIZE: 14 }
        }
    ]
}

upgrade(["accelerator"], "wreckingBall")
