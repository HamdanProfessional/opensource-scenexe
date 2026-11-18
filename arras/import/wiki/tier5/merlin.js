Class.merlin = {
    PARENT: "genericTank",
    LABEL: "Merlin",
    DANGER: 8,
    BODY: Class.falcon.BODY,
    GUNS: [...Class.falcon.GUNS, Class.booster.GUNS[1], Class.booster.GUNS[2]]
}
upgrade(["falcon", "booster"], "merlin")
