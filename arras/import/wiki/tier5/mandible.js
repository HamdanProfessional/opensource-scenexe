Class.mandible = {
    PARENT: "genericTank",
    LABEL: "Mandible",
    DANGER: 8,
    BODY: Class.quadAngle.BODY,
    GUNS: Class.quadAngle.GUNS,
    TURRETS: Class.quadAngle.TURRETS.map(turret => ({
        POSITION: { ...turret.POSITION, SIZE: 11 },
        TYPE: "gunnerTurret"
    }))
}
upgrade(["quadAngle"], "mandible")
