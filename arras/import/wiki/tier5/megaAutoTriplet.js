const { makeAuto } = require("../facilitators.js")
const preset = require("../presets.js")

Class.megaAutoTriplet = {
    ...makeAuto("tripleShot", "Mega-Auto Triplet", preset.makeAuto.mega),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoTripleShot"], "megaAutoTriplet")
