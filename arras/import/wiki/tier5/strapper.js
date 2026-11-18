const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.strapper = {
    ...makeOver("zipper", "Strapper", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["cropDuster", "zipper"], "strapper")
