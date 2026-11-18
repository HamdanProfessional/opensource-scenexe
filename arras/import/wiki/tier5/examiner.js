Class.examiner = {
    PARENT: "genericTank",
    LABEL: "Examiner",
    DANGER: 8,
    BODY: Class.enforcer.BODY,
    INVISIBLE: Class.stalker.INVISIBLE,
    TOOLTIP: Class.stalker.TOOLTIP,
    GUNS: Class.enforcer.GUNS
}
upgrade(["stalker", "enforcer"], "examiner")
