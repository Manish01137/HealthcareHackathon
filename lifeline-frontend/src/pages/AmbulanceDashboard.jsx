import { useState, useEffect } from "react"
import API from "../services/api"

function AmbulanceDashboard() {
    const [ambulances, setAmbulances] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ambRes, hospRes] = await Promise.all([
                    API.get("/ambulance"),
                    API.get("/hospitals")
                ]);
                setAmbulances(ambRes.data);
                setHospitals(hospRes.data);
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData();
        const intv = setInterval(fetchData, 8000);
        return () => clearInterval(intv);
    }, [])

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">🚑</span> Active Unit Dashboard
            </h2>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading active fleets...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {ambulances.map(amb => {
                        const hosp = hospitals.find(h => h.id === amb.selectedHospitalId);

                        // Fake patient info attached to ambulance for dashboard display
                        const patientSeverity = amb.status === "en-route" ? (amb.id === "AMB-001" ? "CRITICAL" : "HIGH") : "NONE";
                        const eta = amb.status === "en-route" ? "8 mins" : "N/A";
                        const distance = amb.status === "en-route" ? "1.2 km" : "N/A";

                        return (
                            <div key={amb.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className={`px-6 py-4 text-white flex justify-between items-center ${amb.status === "en-route" ? "bg-red-600" : "bg-green-600"
                                    }`}>
                                    <div>
                                        <h3 className="text-2xl font-bold">{amb.id}</h3>
                                        <p className="text-sm opacity-80 uppercase tracking-widest">{amb.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">👨‍✈️ {amb.driver}</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Patient Status</p>
                                            <span className={`px-2 py-1 flex justify-center text-xs font-bold rounded-lg ${patientSeverity === "CRITICAL" ? "bg-red-100 text-red-700" :
                                                    patientSeverity === "HIGH" ? "bg-orange-100 text-orange-700" :
                                                        "bg-gray-100 text-gray-500"
                                                }`}>
                                                {patientSeverity}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-1">ETA</p>
                                            <p className="text-lg font-extrabold text-blue-700 text-center">{eta}</p>
                                        </div>
                                    </div>

                                    {amb.status === "en-route" && hosp ? (
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                                            <h4 className="font-bold text-blue-900 mb-2">📍 Target Facility</h4>

                                            <p className="text-lg font-bold text-blue-800 mb-1">{hosp.name}</p>
                                            <p className="text-sm text-blue-600 font-semibold mb-3">Distance: {distance}</p>

                                            <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                                <div className="bg-white rounded-lg p-2 shadow-sm">
                                                    <p className="font-bold text-red-600">{hosp.icuBeds || hosp.icu || 0}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">ICU Beds</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 shadow-sm">
                                                    <p className="font-bold text-green-600">{hosp.ventilators || hosp.vent || 0}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Ventilators</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
                                            <p className="font-bold text-green-800">✅ Available for Dispatch</p>
                                            <p className="text-sm text-green-600 mt-1">Holding at base</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AmbulanceDashboard
