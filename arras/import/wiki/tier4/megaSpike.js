const { weaponArray } = require("../facilitators.js")

Class.megaSpike = {
    PARENT: "genericSmasher",
    LABEL: "Mega Spike",
    SIZE: Class.genericTank.SIZE * 1.3,
    BODY: {
        ...Class.megaSmasher.BODY,
        DAMAGE: Class.spike.BODY.DAMAGE,
        PUSHABILITY: 0.5
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 24 }
        }, 4)
    ]
}

upgrade(["megaSmasher", "spike"], "megaSpike")
