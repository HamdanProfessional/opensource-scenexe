const { makeRadialAuto } = require("../facilitators.js")

Class.mega5 = makeRadialAuto("megaAutoTankGun", {
    isTurret: true,
    danger: 8,
    size: 12,
    x: 9,
    label: "Mega-5",
    count: 5,
    body: { SPEED: Class.mega3.BODY.SPEED * 0.97 }
})
upgrade(["auto5", "mega3"], "mega5")
