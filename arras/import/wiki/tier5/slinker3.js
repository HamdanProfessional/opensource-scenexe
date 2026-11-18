const { makeRadialAuto } = require("../facilitators.js")

Class.slinker3 = makeRadialAuto("megaAutoTankGun", {
    isTurret: true,
    danger: 8,
    size: 14,
    label: "Slinker-3",
    body: { SPEED: Class.mega3.BODY.SPEED }
})
Class.slinker3.INVISIBLE = [0.08, 0.03]
Class.slinker3.TOOLTIP = "Stay still to turn invisible."
upgrade(["mega3"], "slinker3")
