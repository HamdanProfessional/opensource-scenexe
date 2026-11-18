const { weaponArray } = require("../facilitators.js")

Class.spear = {
    PARENT: "genericSmasher",
    LABEL: "Spear",
    SIZE: Class.bonker.SIZE,
    BODY: {
        ...Class.bonker.BODY,
        DAMAGE: Class.spike.BODY.DAMAGE
    },
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 18 }
        }, 4)
    ]
}

upgrade(["spike", "bonker"], "spear")
