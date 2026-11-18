Class.ruiner = {
    PARENT: "genericTank",
    LABEL: "Ruiner",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.ordnance.GUNS, Class.mortar.GUNS[0], Class.mortar.GUNS[1]]
}
upgrade(["ordnance", "mortar"], "ruiner")
