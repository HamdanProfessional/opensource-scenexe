Class.waster = {
    PARENT: "genericTank",
    LABEL: "Waster",
    DANGER: 8,
    BODY: Class.quadAngle.BODY,
    GUNS: Class.quadAngle.GUNS,
    TURRETS: Class.quadAngle.TURRETS.map(turret => ({
        POSITION: { ...turret.POSITION, SIZE: 10 },
        TYPE: "sniperTurret"
    }))
}
upgrade(["quadAngle"], "waster")
