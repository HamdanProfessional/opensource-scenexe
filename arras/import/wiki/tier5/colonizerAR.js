const { makeDrive } = require("../facilitators.js")

Class.colonizerAR = {
    ...makeDrive("zipper", "Colonizer", "swarm"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["zipper"], "colonizerAR")
