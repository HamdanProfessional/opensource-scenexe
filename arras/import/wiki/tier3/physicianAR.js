Class.physicianAR = {
    PARENT: "genericSmasher",
    LABEL: "Physician",
    HEALING_TANK: true,
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: "healerHat",
            POSITION: { SIZE: 13, LAYER: 1 }
        }
    ]
}

upgrade(["healerAR"], "physicianAR")
