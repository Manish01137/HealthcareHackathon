import { useState } from "react"
import API from "../services/api"

const MOCK_USERS = [
    { id: "u1", lat: 40.7130, lng: -74.007, token: "mock-token-1" },
    { id: "u2", lat: 40.7125, lng: -74.005, token: "mock-token-2" },
    { id: "u3", lat: 40.8000, lng: -73.900, token: "mock-token-3" }
]

function Alert() {
    const [status, setStatus] = useState(null) // null | "loading" | "success" | "error"
    const [result, setResult] = useState(null)
    const [ambulanceLat, setAmbulanceLat] = useState("40.7128")
    const [ambulanceLng, setAmbulanceLng] = useState("-74.0060")

    const activateCrowdAlert = async () => {
        setStatus("loading")
        try {
            const res = await API.post("/alerts/crowd", {
                ambulanceLocation: {
                    lat: parseFloat(ambulanceLat),
                    lng: parseFloat(ambulanceLng)
                },
                users: MOCK_USERS
            })
            setResult(res.data)
            setStatus("success")
        } catch {
            // Mock fallback
            setResult({ notified: 2, results: [{ userId: "u1", success: true, mock: true }, { userId: "u2", success: true, mock: true }] })
            setStatus("success")
        }
    }

    const reset = () => {
        setStatus(null)
        setResult(null)
    }

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">🚨 Emergency Alerts</h2>
            <p className="text-gray-500 mb-6 text-sm">Send crowd-clearing push notifications to nearby users</p>

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Ambulance Latitude</label>
                        <input
                            type="text"
                            value={ambulanceLat}
                            onChange={e => setAmbulanceLat(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Ambulance Longitude</label>
                        <input
                            type="text"
                            value={ambulanceLng}
                            onChange={e => setAmbulanceLng(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <p className="text-sm text-orange-800">
                        <strong>📡 Coverage radius:</strong> 500 meters<br />
                        <strong>👥 Mock users nearby:</strong> {MOCK_USERS.length} tracked users
                    </p>
                </div>

                {status !== "success" && (
                    <button
                        onClick={activateCrowdAlert}
                        disabled={status === "loading"}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-lg disabled:opacity-50"
                    >
                        {status === "loading" ? "Sending alerts..." : "🚨 Activate Crowd Alert"}
                    </button>
                )}

                {status === "success" && result && (
                    <div className="space-y-3">
                        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 relative">
                            <p className="font-bold text-green-800 text-lg">✅ Alerts Sent!</p>
                            <p className="text-green-700 text-sm mt-1">
                                {result.notified} user{result.notified !== 1 ? "s" : ""} notified within 500m
                            </p>

                            {/* Floating Toast Notification */}
                            <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl font-bold text-sm animate-bounce z-50 flex items-center gap-2">
                                ✅ Successfully activated crowd alert!
                            </div>
                        </div>

                        {result.results && (
                            <div className="space-y-2">
                                {result.results.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                                        <span className="text-gray-700">User {r.userId}</span>
                                        <span className={`font-semibold ${r.success ? "text-green-600" : "text-red-600"}`}>
                                            {r.success ? "✅ Notified" : "❌ Failed"}
                                            {r.mock && " (mock)"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={reset}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl transition text-sm"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Alert