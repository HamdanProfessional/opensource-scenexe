Class.hawker = {
    PARENT: "genericTank",
    LABEL: "Hawker",
    DANGER: 8,
    BODY: {
        ...Class.ranger.BODY,
        FOV: Class.ranger.BODY.FOV * 1.05
    },
    INVISIBLE: Class.stalker.INVISIBLE,
    TOOLTIP: Class.stalker.TOOLTIP,
    GUNS: Class.ranger.GUNS
}
upgrade(["ranger", "stalker"], "hawker")
