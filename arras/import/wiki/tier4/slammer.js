const { base } = require("../constants.js")

Class.slammer = {
    PARENT: "genericSmasher",
    LABEL: "Slammer",
    SIZE: Class.genericTank.SIZE * 1.7,
    BODY: {
        HEALTH: base.HEALTH * 1.4,
        SPEED: base.SPEED * 0.85,
        FOV: base.FOV * 0.85,
        DENSITY: base.DENSITY * 3
    },
    TURRETS: [
        {
            TYPE: "digDigHat",
            POSITION: { SIZE: 30 }
        }
    ]
}

upgrade(["banger"], "slammer")
