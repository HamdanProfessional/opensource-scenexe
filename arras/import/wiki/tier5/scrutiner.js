Class.scrutiner = {
    PARENT: "genericTank",
    LABEL: "Scrutiner",
    DANGER: 8,
    BODY: Class.courser.BODY,
    CONTROLLERS: Class.courser.CONTROLLERS,
    INVISIBLE: Class.stalker.INVISIBLE,
    TOOLTIP: "Hold right click to zoom. Stay still to turn invisible.",
    GUNS: Class.courser.GUNS
}
upgrade(["courser"], "scrutiner")
