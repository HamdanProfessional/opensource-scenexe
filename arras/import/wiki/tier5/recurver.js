Class.recurver = {
    PARENT: "genericTank",
    LABEL: "Recurver",
    DANGER: 8,
    BODY: Class.crossbow.BODY,
    GUNS: Class.crossbow.GUNS.map(gun => ({
        ...gun,
        POSITION: { ...gun.POSITION, ANGLE: 0 }
    }))
}
upgrade(["crossbow"], "recurver")
