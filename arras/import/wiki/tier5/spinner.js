
Class.spinner = {
    PARENT: "genericTank",
    LABEL: "Spinner",
    DANGER: 8,
    BODY: Class.twister.BODY,
    GUNS: [
        ...Class.twister.GUNS,
        Class.fieldGun.GUNS[0],
        Class.fieldGun.GUNS[1]
    ]
}

upgrade(["fieldGun", "twister"], "spinner")
