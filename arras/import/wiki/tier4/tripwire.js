Class.tripwire = {
    PARENT: "genericSmasher",
    LABEL: "Tripwire",
    SIZE: Class.genericTank.SIZE * 1.3,
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: Class.landmine.TOOLTIP,
    TURRETS: [
        {
            TYPE: ["octagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 27 }
        },
        {
            TYPE: ["octagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 27, ANGLE: 22.5 }
        }
    ]
}

upgrade(["landmine", "banger"], "tripwire")
