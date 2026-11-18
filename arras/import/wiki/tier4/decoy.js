Class.decoy = {
    PARENT: "genericSmasher",
    LABEL: "Decoy",
    SIZE: Class.bonker.SIZE,
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: Class.landmine.TOOLTIP,
    BODY: Class.bonker.BODY,
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

upgrade(["landmine", "bonker"], "decoy")
