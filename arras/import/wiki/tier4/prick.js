const { weaponArray } = require("../facilitators.js")

Class.prick = {
    PARENT: "genericSmasher",
    LABEL: "Prick",
    SIZE: Class.genericTank.SIZE * 1.3,
    BODY: Class.spike.BODY,
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 22 }
        }, 4)
    ]
}

upgrade(["spike", "banger"], "prick")
