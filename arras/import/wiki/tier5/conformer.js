const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.conformer = makeOver("quadAngle", "Conformer", { ...preset.hybrid, renderBehind: true })
upgrade(["quadAngle"], "conformer")
