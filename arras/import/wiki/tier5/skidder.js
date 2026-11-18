
Class.skidder = {
    PARENT: "genericTank",
    LABEL: "Skidder",
    DANGER: 8,
    BODY: Class.skimmer.BODY,
    GUNS: [
        ...Class.skimmer.GUNS,
        Class.fieldGun.GUNS[0],
        Class.fieldGun.GUNS[1]
    ]
}

upgrade(["fieldGun", "skimmer"], "skidder")
