Class.rustler = {
    PARENT: "genericTank",
    LABEL: "Rustler",
    DANGER: 8,
    BODY: Class.predator.BODY,
    CONTROLLERS: Class.predator.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.predator.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["predator", "poacher"], "rustler")
