Class.immolater = {
    PARENT: "genericTank",
    LABEL: "Immolater",
    DANGER: 8,
    BODY: Class.courser.BODY,
    CONTROLLERS: Class.courser.CONTROLLERS,
    GUNS: [...Class.courser.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["hitman", "courser", "poacher"], "immolater")
