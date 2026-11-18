const { makeRadialAuto, makeTurret } = require("../facilitators.js")

Class.autoGunnerTankGun = makeTurret("gunner", { canRepel: true, limitFov: true })

Class.auto6 = makeRadialAuto("autoGunnerTankGun", { isTurret: true, danger: 8, size: 10, x: 9, label: "Auto-6", count: 6 })
upgrade(["auto5", "auto4"], "auto6")
