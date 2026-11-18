Class.escort = {
    PARENT: "genericTank",
    LABEL: "Escort",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [Class.beekeeper.GUNS[0], Class.beekeeper.GUNS[1], ...Class.ordnance.GUNS.slice(2)]
}
upgrade(["ordnance", "beekeeper"], "escort")
