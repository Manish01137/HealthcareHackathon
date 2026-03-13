// In-memory ambulance store for prototype
const ambulances = [
    {
        id: "AMB-001",
        driver: "Rajesh Kumar",
        status: "en-route",
        lat: 40.7128,
        lng: -74.006,
        speed: 60,
        patient: null
    },
    {
        id: "AMB-002",
        driver: "Priya Sharma",
        status: "available",
        lat: 40.7282,
        lng: -73.994,
        speed: 0,
        patient: null
    }
]

export const getAmbulances = (req, res) => {
    res.json(ambulances)
}

export const updateAmbulanceLocation = (req, res) => {
    const { id } = req.params
    const { lat, lng, speed, status } = req.body

    const amb = ambulances.find(a => a.id === id)
    if (!amb) {
        return res.status(404).json({ error: "Ambulance not found" })
    }

    if (lat !== undefined) amb.lat = lat
    if (lng !== undefined) amb.lng = lng
    if (speed !== undefined) amb.speed = speed
    if (status !== undefined) amb.status = status

    res.json(amb)
}

export const dispatchAmbulance = (req, res) => {
    const { patientLocation, patientInfo } = req.body

    // Find nearest available ambulance
    const available = ambulances.filter(a => a.status === "available")
    if (available.length === 0) {
        return res.status(503).json({ error: "No ambulances available" })
    }

    const dispatched = available[0]
    dispatched.status = "dispatched"
    dispatched.patient = patientInfo || null

    res.json({
        message: "Ambulance dispatched",
        ambulance: dispatched,
        eta: "8 minutes"
    })
}
