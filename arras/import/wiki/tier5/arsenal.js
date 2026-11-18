Class.arsenal = {
    PARENT: "genericTank",
    LABEL: "Arsenal",
    DANGER: 8,
    BODY: Class.predator.BODY,
    CONTROLLERS: Class.predator.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.ordnance.GUNS.slice(0, 2), ...Class.predator.GUNS]
}
upgrade(["predator", "ordnance"], "arsenal")
