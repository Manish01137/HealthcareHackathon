import express from "express"
import { getAmbulances, updateAmbulanceLocation, dispatchAmbulance } from "../controllers/ambulanceController.js"

const router = express.Router()

router.get("/", getAmbulances)
router.put("/:id/location", updateAmbulanceLocation)
router.post("/dispatch", dispatchAmbulance)

export default router
