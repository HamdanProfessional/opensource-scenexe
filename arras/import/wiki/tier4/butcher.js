Class.butcherAR = {
    PARENT: "genericTank",
    LABEL: "Butcher",
    DANGER: 7,
    BODY: Class.hunter.BODY,
    CONTROLLERS: Class.hunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.hunter.GUNS, Class.bushwhacker.GUNS[1], Class.bushwhacker.GUNS[2]]
}
upgrade(["hunter", "bushwhacker"], "butcherAR")
