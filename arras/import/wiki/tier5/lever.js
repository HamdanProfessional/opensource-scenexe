Class.lever = {
    PARENT: "genericTank",
    LABEL: "Lever",
    DANGER: 8,
    BODY: Class.crowbar.BODY,
    GUNS: Class.crowbar.GUNS,
    TURRETS: Class.crowbar.TURRETS.map(turret => ({ ...turret, TYPE: "sniper3gun" }))
}
upgrade(["sniper3", "crowbar"], "lever")
