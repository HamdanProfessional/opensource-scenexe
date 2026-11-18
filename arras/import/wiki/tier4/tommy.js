Class.tommyAR = {
    PARENT: "genericTank",
    LABEL: "Tommy",
    DANGER: 7,
    BODY: Class.minigun.BODY,
    GUNS: [...Class.minigun.GUNS, Class.bushwhacker.GUNS[1], Class.bushwhacker.GUNS[2]]
}
upgrade(["bushwhacker", "minigun"], "tommyAR")
