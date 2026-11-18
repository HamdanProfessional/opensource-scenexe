
Class.carronade = {
    PARENT: "genericTank",
    LABEL: "Carronade",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: [
        Class.beekeeper.GUNS[0],
        Class.beekeeper.GUNS[1],
        ...Class.launcher.GUNS
    ]
}

upgrade(["beekeeper", "fieldGun"], "carronade")
