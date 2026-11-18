const { makeRadialAuto } = require("../facilitators.js")

Class.rifle3 = makeRadialAuto("rifle", {
    turretIdentifier: "rifle3gun",
    label: "Rifle-3",
    danger: 8,
    size: 13,
    body: Class.sniper3.BODY
})
upgrade(["enforcer", "sniper3"], "rifle3")
