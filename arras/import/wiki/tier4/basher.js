Class.basher = {
    PARENT: "genericSmasher",
    LABEL: "Basher",
    SIZE: Class.bonker.SIZE * 0.85,
    BODY: {
        ...Class.bonker.BODY,
        SPEED: Class.bonker.BODY.SPEED * 1.1
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 21.5 }
        }
    ]
}

upgrade(["bonker"], "basher")
