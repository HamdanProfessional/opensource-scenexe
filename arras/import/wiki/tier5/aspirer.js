const { weaponMirror } = require("../facilitators.js")

Class.aspirer = {
    PARENT: "genericTank",
    LABEL: "Aspirer",
    DANGER: 8,
    BODY: Class.booster.BODY,
    TURRETS: Class.quadAngle.TURRETS,
    GUNS: Class.booster.GUNS.slice(1)
}
upgrade(["booster", "quadAngle"], "aspirer")
