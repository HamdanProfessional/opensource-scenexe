Class.harpoon = {
    PARENT: "genericTank",
    LABEL: "Harpoon",
    DANGER: 8,
    BODY: Class.crossbow.BODY,
    GUNS: [...Class.crossbow.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["crossbow", "armsman"], "harpoon")
