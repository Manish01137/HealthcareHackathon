import express from "express"
import { hospitals } from "../data/hospitals.js"
import { rankHospitals } from "../services/hospitalRankService.js"

const router = express.Router()

// Get hospitals
router.get("/", (req, res) => {
  res.json(hospitals)
})

// AI hospital ranking
router.post("/rank", (req, res) => {

  const { patient, location } = req.body

  if (!patient) {
    return res.status(400).json({ error: "patient required" })
  }

  const ranked = rankHospitals(patient, location)

  res.json(ranked)
})

export default router