Class.pique = {
    PARENT: "genericTank",
    LABEL: "Pique",
    DANGER: 8,
    BODY: Class.enforcer.BODY,
    GUNS: [...Class.enforcer.GUNS, ...Class.crossbow.GUNS.slice(0, 6)]
}
upgrade(["enforcer", "crossbow"], "pique")
