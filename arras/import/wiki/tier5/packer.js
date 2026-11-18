
Class.packer = {
    PARENT: "genericTank",
    LABEL: "Packer",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: [
        ...Class.swarmer.GUNS,
        Class.fieldGun.GUNS[0],
        Class.fieldGun.GUNS[1]
    ]
}

upgrade(["fieldGun", "swarmer"], "packer")
