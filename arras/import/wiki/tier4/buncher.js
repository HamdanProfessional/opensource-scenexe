const { base } = require("../constants.js")

Class.buncher = {
    PARENT: "genericSmasher",
    LABEL: "Buncher",
    BODY: {
        ACCELERATION: base.ACCEL * 0.6,
        SPEED: base.SPEED * 1.4
    },
    TURRETS: [
        {
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        }
    ]
}

upgrade(["drifter"], "buncher")
