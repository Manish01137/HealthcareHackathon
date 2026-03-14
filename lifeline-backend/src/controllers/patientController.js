import { assessSeverity } from "../services/severityService.js"
import { calculateDisasterAllocation } from "../services/disasterService.js"

export const evaluatePatient = (req, res) => {

    const severity = assessSeverity(req.body)

    res.json({
        severity
    })
}

export const allocateDisasterPatients = (req, res) => {

    const { patients } = req.body

    if (!patients || !Array.isArray(patients)) {
        return res.status(400).json({
            error: "patients array is required"
        })
    }

    const evaluatedPatients = patients.map(p => ({
        ...p,
        severity: assessSeverity(p).level
    }))

    const allocationResults =
        calculateDisasterAllocation(evaluatedPatients)

    res.json(allocationResults)
}