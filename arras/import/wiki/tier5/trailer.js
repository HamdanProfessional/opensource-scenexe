Class.trailerAR = {
    PARENT: "genericTank",
    LABEL: "Trailer",
    DANGER: 8,
    BODY: Class.stalker.BODY,
    INVISIBLE: Class.stalker.INVISIBLE,
    TOOLTIP: Class.stalker.TOOLTIP,
    GUNS: [...Class.stalker.GUNS, Class.hitman.GUNS[2]]
}
upgrade(["stalker", "hitman"], "trailerAR")
