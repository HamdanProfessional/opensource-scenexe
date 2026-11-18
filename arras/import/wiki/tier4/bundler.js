Class.bundler = {
    PARENT: "genericSmasher",
    LABEL: "Bundler",
    SIZE: Class.bonker.SIZE,
    BODY: Class.bonker.BODY,
    TURRETS: [
        {
            TYPE: ["squareHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        }
    ]
}

upgrade(["bonker", "drifter"], "bundler")
