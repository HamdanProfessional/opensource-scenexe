Class.vessel = {
    PARENT: "genericSmasher",
    LABEL: "Vessel",
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: Class.landmine.TOOLTIP,
    TURRETS: [
        {
            TYPE: ["squareHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        },
        {
            TYPE: ["squareHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 21.5, ANGLE: 45 }
        }
    ]
}

upgrade(["landmine", "drifter"], "vessel")
