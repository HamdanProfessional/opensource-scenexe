const { makeRadialAuto } = require("../facilitators.js")

Class.hunter3 = {
    ...makeRadialAuto("courser", {
        turretIdentifier: "hunter3gun",
        label: "Hunter-3",
        danger: 8,
        size: 13,
        body: Class.sniper3.BODY
    }),
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom."
}
upgrade(["sniper3", "courser"], "hunter3")
