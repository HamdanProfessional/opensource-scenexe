Class.megaDrifter = {
    PARENT: "genericSmasher",
    LABEL: "Mega Drifter",
    SIZE: Class.genericTank.SIZE * 1.3,
    BODY: {
        ...Class.megaSmasher.BODY,
        PUSHABILITY: 0.5
    },
    TURRETS: [
        {
            TYPE: ["squareHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 26 }
        }
    ]
}

upgrade(["megaSmasher", "drifter"], "megaDrifter")
