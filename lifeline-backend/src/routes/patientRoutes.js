import express from "express"
import { evaluatePatient, allocateDisasterPatients } from "../controllers/patientController.js"

const router = express.Router()

// Assess patient severity
router.post("/evaluate", evaluatePatient)

// Disaster allocation
router.post("/disaster", allocateDisasterPatients)

export default router