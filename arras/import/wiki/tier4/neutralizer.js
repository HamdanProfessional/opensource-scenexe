const { base } = require("../constants.js")

Class.neutralizer = {
    PARENT: "genericSmasher",
    LABEL: "Neutralizer",
    SIZE: Class.genericTank.SIZE * 1.2,
    BODY: {
        ...Class.megaSmasher.BODY,
        PUSHABILITY: 0,
        RESIST: 2,
        ACCELERATION: base.ACCEL * 1.4
    },
    TURRETS: [
        {
            TYPE: ["decagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 26 }
        }
    ]
}

upgrade(["accelerator"], "neutralizer")
