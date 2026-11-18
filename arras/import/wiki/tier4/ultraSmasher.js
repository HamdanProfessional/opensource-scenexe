Class.ultraSmasher = {
    PARENT: "genericSmasher",
    LABEL: "Ultra Smasher",
    SIZE: Class.genericTank.SIZE * 1.5,
    BODY: {
        ...Class.megaSmasher.BODY,
        DENSITY: Class.megaSmasher.BODY.DENSITY * 2,
        PUSHABILITY: 0.3,
        SPEED: Class.megaSmasher.BODY.SPEED * 0.9
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 32 }
        }
    ]
}

upgrade(["megaSmasher"], "ultraSmasher")
