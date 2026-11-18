Class.huntsman = {
    PARENT: "genericTank",
    LABEL: "Huntsman",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.ordnance.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["poacher", "ordnance", "force"], "huntsman")
