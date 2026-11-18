Class.megaBanger = {
    PARENT: "genericSmasher",
    LABEL: "Mega Banger",
    SIZE: Class.genericTank.SIZE * 1.6,
    BODY: {
        ...Class.megaSmasher.BODY,
        PUSHABILITY: 0.5,
        SPEED: Class.megaSmasher.BODY.SPEED * 0.8
    },
    TURRETS: [
        {
            TYPE: "digDigHat",
            POSITION: { SIZE: 31 }
        }
    ]
}

upgrade(["megaSmasher", "banger"], "megaBanger")
