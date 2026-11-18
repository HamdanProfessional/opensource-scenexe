Class.carnage = {
    PARENT: "genericTank",
    LABEL: "Carnage",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.ordnance.GUNS, ...Class.crossbow.GUNS.slice(0, 6)]
}
upgrade(["ordnance", "prober", "crossbow"], "carnage")
