Class.pilfer = {
    PARENT: "genericTank",
    LABEL: "Pilfer",
    DANGER: 8,
    BODY: Class.prober.BODY,
    CONTROLLERS: Class.prober.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.prober.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["poacher", "prober", "armsman"], "pilfer")
