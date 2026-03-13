import express from "express"
import { getHospitals, getRankedHospitals } from "../controllers/hospitalController.js"

const router = express.Router()

router.get("/", getHospitals)
router.get("/ranked", getRankedHospitals)

export default router