const { statnames } = require("../constants.js")

Class.fleeter = {
    PARENT: "genericTank",
    LABEL: "Fleeter",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.bomber.BODY,
    TURRETS: Class.quadAngle.TURRETS,
    GUNS: Class.bomber.GUNS.slice(1)
}
upgrade(["bomber", "quadAngle"], "fleeter")
