Class.thwacker = {
    PARENT: "genericSmasher",
    LABEL: "Thwacker",
    SIZE: Class.bonker.SIZE * 1.2,
    BODY: Class.bonker.BODY,
    TURRETS: [
        {
            TYPE: ["octagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 24 }
        }
    ]
}

upgrade(["bonker", "banger"], "thwacker")
