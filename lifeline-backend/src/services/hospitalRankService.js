import { getDistance } from "geolib";

export function rankHospitals(patient, ambulanceLocation, hospitals) {
    return hospitals
        .map((hospital) => {
            // getDistance expects {latitude, longitude}
            // If our input is {lat, lng}, map it manually for geolib if needed.
            const ambLocation = ambulanceLocation.latitude !== undefined
                ? { latitude: ambulanceLocation.latitude, longitude: ambulanceLocation.longitude }
                : { latitude: ambulanceLocation.lat, longitude: ambulanceLocation.lng };

            const hospLocation = hospital.latitude !== undefined
                ? { latitude: hospital.latitude, longitude: hospital.longitude }
                : { latitude: hospital.lat, longitude: hospital.lng };

            const distanceInMeters = getDistance(ambLocation, hospLocation);

            const icu = hospital.icuBeds || hospital.icu || 0;
            const vents = hospital.ventilators || hospital.vent || 0;
            const docs = hospital.doctors || 0;

            const score = (icu * 5) + (vents * 4) + (docs * 2) - (distanceInMeters / 100);

            const reasons = [];
            if (icu > 0) reasons.push("ICU beds available");
            if (vents > 0) reasons.push("Ventilator support");
            if (docs > 0) reasons.push("Doctors available");

            const reason = `Selected because ${reasons.join(", ")} and distance is ${(distanceInMeters / 1000).toFixed(1)}km.`;

            return {
                hospital,
                score,
                distance: distanceInMeters,
                reason
            };
        })
        .sort((a, b) => b.score - a.score);
}