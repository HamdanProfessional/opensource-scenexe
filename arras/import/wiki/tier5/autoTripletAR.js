const { makeAuto } = require("../facilitators.js")

Class.autoTripletAR = {
    ...makeAuto("triplet", "Auto-Triplet"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["triplet","autoTripleShot"], "autoTripletAR")
