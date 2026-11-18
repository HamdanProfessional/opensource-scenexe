Class.megaPoacher = {
    PARENT: "genericTank",
    LABEL: "Mega Poacher",
    DANGER: 8,
    BODY: Class.megaHunter.BODY,
    CONTROLLERS: Class.megaHunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [...Class.megaHunter.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["poacher", "megaHunter"], "megaPoacher")
