import express from "express"
import { evaluatePatient } from "../controllers/patientController.js"

const router = express.Router()

router.post("/severity", evaluatePatient)

export default router