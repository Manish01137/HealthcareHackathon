import { getNearbyUsers } from "../services/geofenceService.js"
import { sendAlert } from "../services/notificationService.js"

export const triggerCrowdAlert = async (req, res) => {

    const { ambulanceLocation, users } = req.body

    if (!ambulanceLocation || !users || !Array.isArray(users)) {
        return res.status(400).json({ error: "ambulanceLocation and users array are required" })
    }

    const nearbyUsers = getNearbyUsers(ambulanceLocation, users)

    const results = []
    for (const user of nearbyUsers) {
        const result = await sendAlert(user.token || "mock-token")
        results.push({ userId: user.id, ...result })
    }

    res.json({
        notified: nearbyUsers.length,
        results
    })

}