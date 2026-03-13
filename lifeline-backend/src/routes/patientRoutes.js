import express from "express"
import { evaluatePatient, allocateDisasterPatients } from "../controllers/patientController.js"

const router = express.Router()

router.post("/severity", evaluatePatient)
router.post("/disaster", allocateDisasterPatients)

export default router