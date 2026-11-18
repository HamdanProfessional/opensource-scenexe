const { makeRadialAuto } = require("../facilitators.js")

Class.auto7 = makeRadialAuto("autoTankGun", { isTurret: true, danger: 8, size: 9, x: 9, label: "Auto-7", count: 7 })
upgrade(["auto5"], "auto7")
