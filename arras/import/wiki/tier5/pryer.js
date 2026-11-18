Class.pryer = {
    PARENT: "genericTank",
    LABEL: "Pryer",
    DANGER: 8,
    BODY: Class.crowbar.BODY,
    GUNS: Class.crowbar.GUNS,
    TURRETS: [14, 21, 28, 35, 42].map(x => ({
        TYPE: "crowbarTurretTank",
        POSITION: { SIZE: 5, X: x, ARC: 180, LAYER: 1 }
    }))
}
upgrade(["auto5", "crowbar"], "pryer")
