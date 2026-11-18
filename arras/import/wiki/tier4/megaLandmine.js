Class.megaLandmine = {
    PARENT: "genericSmasher",
    LABEL: "Mega Landmine",
    SIZE: Class.genericTank.SIZE * 1.3,
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: Class.landmine.TOOLTIP,
    BODY: {
        ...Class.megaSmasher.BODY,
        PUSHABILITY: 0.5
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 26 }
        },
        {
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
            POSITION: { SIZE: 26, ANGLE: 90 }
        }
    ]
}

upgrade(["megaSmasher", "landmine"], "megaLandmine")
