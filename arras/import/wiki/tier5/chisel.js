Class.chisel = {
    PARENT: "genericTank",
    LABEL: "Chisel",
    DANGER: 8,
    BODY: Class.crowbar.BODY,
    GUNS: Class.crowbar.GUNS,
    TURRETS: [15.5, 24, 32.5, 41].map(x => ({
        TYPE: "crowbarTurretTank",
        POSITION: { SIZE: 5.5, X: x, ARC: 180, LAYER: 1 }
    }))
}
upgrade(["auto4", "crowbar"], "chisel")
