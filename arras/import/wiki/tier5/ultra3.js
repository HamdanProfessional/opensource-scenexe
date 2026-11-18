const { makeRadialAuto } = require("../facilitators.js")

Class.ultra3 = makeRadialAuto("ultraAutoTankGun", {
    isTurret: true,
    danger: 8,
    size: 16,
    x: 9,
    label: "Ultra-3",
    body: { SPEED: Class.mega3.BODY.SPEED * 0.95 }
})
upgrade(["mega3"], "ultra3")
