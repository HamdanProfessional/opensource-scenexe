const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.consolidator = {
    ...makeOver("triAngle", "Consolidator", {
        ...preset.hybrid,
        renderBehind: true,
        maxDrones: 1,
        extraStats: [{ size: 2, health: 2, damage: 1.6, speed: 0.9, reload: 1.5 }]
    }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}
upgrade(["integrator"], "consolidator")
