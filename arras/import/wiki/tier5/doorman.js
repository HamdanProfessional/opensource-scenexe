Class.doormanAR = {
    PARENT: "genericTank",
    LABEL: "Doorman",
    DANGER: 8,
    BODY: Class.ranger.BODY,
    GUNS: [...Class.ranger.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["ranger", "hitman"], "doormanAR")
