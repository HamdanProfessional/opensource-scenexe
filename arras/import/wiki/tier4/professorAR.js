const { makeGuard } = require("../facilitators.js")

Class.professorAR = makeGuard(Class.healerAR, "Professor", { type: Class.scientistAR })

upgrade(["scientistAR"], "professorAR")
