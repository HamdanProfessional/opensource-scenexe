Class.megaBonker = {
    PARENT: "genericSmasher",
    LABEL: "Mega Bonker",
    SIZE: Class.bonker.SIZE * 1.3,
    BODY: {
        ...Class.bonker.BODY,
        DENSITY: Class.megaSmasher.BODY.DENSITY,
        PUSHABILITY: 0.5
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 26 }
        }
    ]
}

upgrade(["megaSmasher", "bonker"], "megaBonker")
