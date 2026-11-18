const { weaponArray } = require("../facilitators.js")

Class.claymore = {
    PARENT: "genericSmasher",
    LABEL: "Claymore",
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: Class.landmine.TOOLTIP,
    BODY: Class.spike.BODY,
    TURRETS: [
        ...weaponArray({
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 18 }
        }, 4)
    ]
}

upgrade(["spike", "landmine"], "claymore")
