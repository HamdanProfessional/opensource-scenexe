
Class.rainmaker = {
    PARENT: "genericTank",
    LABEL: "Rainmaker",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: [
        ...Class.mortar.GUNS.slice(0, 4),
        ...Class.launcher.GUNS
    ]
}

upgrade(["mortar", "fieldGun"], "rainmaker")
