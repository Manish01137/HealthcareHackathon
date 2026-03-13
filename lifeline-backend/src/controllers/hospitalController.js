import { hospitals } from "../data/hospitals.js"
import { rankHospitals } from "../services/hospitalRankService.js"

export const getHospitals = (req, res) => {
    res.json(hospitals)
}

export const getRankedHospitals = (req, res) => {
    const { lat, lng, symptoms, age } = req.query

    if (!lat || !lng) {
        return res.status(400).json({ error: "lat and lng query params are required" })
    }

    const ambulanceLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
    }

    const patient = { symptoms, age }
    const ranked = rankHospitals(patient, ambulanceLocation, hospitals)

    res.json(ranked)
}