Class.slayerAR = {
    PARENT: "genericTank",
    LABEL: "Slayer",
    DANGER: 8,
    BODY: Class.enforcer.BODY,
    GUNS: [...Class.enforcer.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["hitman", "enforcer", "armsman"], "slayerAR")
