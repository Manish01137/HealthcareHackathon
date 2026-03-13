import { getDistance } from "geolib"

export function getNearbyUsers(ambulance, users) {
    return users.map(user => {
        const distance = getDistance(
            { latitude: ambulance.lat, longitude: ambulance.lng },
            { latitude: user.lat, longitude: user.lng }
        )
        // Simulate speed of 60km/h (16.6 m/s) to mock ETA
        const speed = 16.6;
        const etaSeconds = Math.round(distance / speed);

        return { ...user, distance, etaSeconds };
    }).filter(u => u.distance <= 500)
}