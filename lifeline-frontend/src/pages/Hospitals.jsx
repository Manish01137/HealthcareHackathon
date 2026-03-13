import { useState, useEffect } from "react"
import API from "../services/api"
import HospitalCard from "../components/HospitalCard"
function Hospitals() {
    const [hospitals, setHospitals] = useState([])
    const [ranked, setRanked] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [view, setView] = useState("list") // "list" | "ranked"

    useEffect(() => {
        fetchHospitals()
    }, [])

    const fetchHospitals = async () => {
        try {
            const res = await API.get("/hospitals")
            setHospitals(res.data)
        } catch {
            // Mock data fallback
            setHospitals([
                { id: 1, name: "Bellevue Hospital", icuBeds: 12, ventilators: 8, doctors: 8, lat: 40.739, lng: -73.975 },
                { id: 2, name: "Mount Sinai", icuBeds: 8, ventilators: 5, doctors: 6, lat: 40.790, lng: -73.953 }
            ])
        } finally {
            setLoading(false)
        }
    }

    const getRanked = async () => {
        setLoading(true)
        try {
            // Use NYC center as default location
            const res = await API.get("/hospitals/ranked?lat=40.7128&lng=-74.006")
            setRanked(res.data)
            setView("ranked")
        } catch {
            // Fallback: sort by icuBeds locally
            const sorted = [...hospitals].sort((a, b) => (b.icuBeds + b.ventilators) - (a.icuBeds + a.ventilators))
            setRanked(sorted)
            setView("ranked")
        } finally {
            setLoading(false)
        }
    }

    const displayList = view === "ranked" ? ranked : hospitals

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">🏥 Hospitals</h2>
                    <p className="text-gray-500 text-sm">View available hospitals and rank by suitability</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={getRanked}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${view === "ranked" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        🧭 Best Match
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading hospitals...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {displayList.map((h, i) => {
                        const hospData = h.hospital || h;
                        if (h.score !== undefined && h.hospital) {
                            hospData.score = h.score;
                            hospData.distance = h.distance;
                            hospData.reason = h.reason;
                        }
                        return <HospitalCard key={hospData.id || i} hospital={hospData} index={i} view={view} />
                    })}
                </div>
            )}
        </div>
    )
}

export default Hospitals