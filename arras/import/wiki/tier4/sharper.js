Class.sharper = {
    PARENT: "genericSmasher",
    LABEL: "Sharper",
    SIZE: Class.genericTank.SIZE * 1.3,
    TURRETS: [
        {
            TYPE: "digDigHat",
            POSITION: { SIZE: 27 }
        },
        {
            TYPE: ["squareHat_spinFast", { COLOR: "black" }],
            POSITION: { SIZE: 18 }
        }
    ]
}

upgrade(["banger", "drifter"], "sharper")
