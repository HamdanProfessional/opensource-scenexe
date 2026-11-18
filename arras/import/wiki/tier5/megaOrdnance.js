Class.megaOrdnance = {
    PARENT: "genericTank",
    LABEL: "Mega Ordnance",
    DANGER: 8,
    BODY: Class.megaHunter.BODY,
    CONTROLLERS: Class.megaHunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.ordnance.GUNS.slice(0, 2), ...Class.megaHunter.GUNS]
}
upgrade(["ordnance", "megaHunter"], "megaOrdnance")
