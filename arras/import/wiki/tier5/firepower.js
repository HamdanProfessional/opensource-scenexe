Class.firepower = {
    PARENT: "genericTank",
    LABEL: "Firepower",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...Class.ordnance.GUNS.slice(0, 2).map(gun => ({
            ...gun,
            POSITION: { ...gun.POSITION, ANGLE: 0 }
        })),
        ...Class.ordnance.GUNS.slice(2)
    ]
}
upgrade(["ordnance", "foctillery"], "firepower")
