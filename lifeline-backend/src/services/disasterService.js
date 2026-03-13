import { hospitals } from "../data/hospitals.js";
import { rankHospitals } from "./hospitalRankService.js";

// A simple deep copy so we can track ICU usages in-memory per run
export function calculateDisasterAllocation(patients) {
    let availableHospitals = JSON.parse(JSON.stringify(hospitals));

    // Sort patients by severity (CRITICAL first, then HIGH, MEDIUM, LOW)
    // Assume patients have a 'severityLevel' or 'priority'
    const priorityMap = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };

    const sortedPatients = [...patients].sort((a, b) => {
        return (priorityMap[b.severity] || 0) - (priorityMap[a.severity] || 0);
    });

    const results = [];

    // Assign patients sequentially
    for (const patient of sortedPatients) {
        // Find best hospital for this specific patient
        // We use a dummy ambulance location for them if not provided, e.g., center of disaster
        const location = patient.location || { lat: 40.7128, lng: -74.006 };

        // rankHospitals with currently available capacities
        const ranked = rankHospitals(patient, location, availableHospitals);

        let assigned = false;
        for (const ranking of ranked) {
            const h = ranking.hospital;
            // Need ICU?
            if (patient.severity === "CRITICAL" || patient.severity === "HIGH") {
                if (h.icuBeds > 0) {
                    h.icuBeds -= 1; // Mark used
                    if (h.ventilators > 0) h.ventilators -= 1;
                    results.push({ patient, assignedHospital: h.name, reason: ranking.reason });
                    assigned = true;
                    break;
                }
            } else {
                // Non-critical, just assign best available with standard beds (simulated by generic availability)
                results.push({ patient, assignedHospital: h.name, reason: ranking.reason });
                assigned = true;
                break;
            }
        }

        if (!assigned && ranked.length > 0) {
            // Overloaded! Just push to the closest one
            results.push({ patient, assignedHospital: ranked[0].hospital.name, reason: "OVERLOAD: Forced assignment" });
        }

        // Update the available hospital list so next patient sees updated ICU capacity
        availableHospitals = ranked.map(r => r.hospital);
    }

    return results;
}
