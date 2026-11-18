Class.pursuer = {
    PARENT: "genericTank",
    LABEL: "Pursuer",
    DANGER: 8,
    BODY: Class.stalker.BODY,
    INVISIBLE: [0.04, 0.06],
    TOOLTIP: Class.stalker.TOOLTIP,
    GUNS: Class.stalker.GUNS
}
upgrade(["stalker"], "pursuer")
