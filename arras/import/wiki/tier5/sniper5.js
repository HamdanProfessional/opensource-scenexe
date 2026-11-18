const { makeRadialAuto } = require("../facilitators.js")

Class.sniper5 = makeRadialAuto("sniper3gun", {
    isTurret: true,
    count: 5,
    label: "Sniper-5",
    danger: 9,
    size: 12,
    body: Class.sniper3.BODY
})
upgrade(["sniper3", "auto5"], "sniper5")
