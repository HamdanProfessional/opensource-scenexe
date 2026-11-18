Class.limpet = {
    PARENT: "genericSmasher",
    LABEL: "Limpet",
    INVISIBLE: [0.006, 0.03],
    TOOLTIP: Class.landmine.TOOLTIP,
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
            POSITION: { SIZE: 21.5, ANGLE: 90 }
        }
    ]
}

upgrade(["landmine"], "limpet")
