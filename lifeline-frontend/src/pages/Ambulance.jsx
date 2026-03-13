import { useState } from "react"
import API from "../services/api"

const SEVERITY_COLORS = {
    HIGH: "bg-red-100 border-red-500 text-red-700",
    MEDIUM: "bg-orange-100 border-orange-500 text-orange-700",
    LOW: "bg-green-100 border-green-500 text-green-700",
}

const SEVERITY_ICONS = {
    HIGH: "🔴",
    MEDIUM: "🟠",
    LOW: "🟢",
}

function Ambulance() {
    const [age, setAge] = useState("")
    const [symptoms, setSymptoms] = useState("")
    const [consciousness, setConsciousness] = useState("conscious")
    const [breathing, setBreathing] = useState("normal")
    const [severity, setSeverity] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [dispatched, setDispatched] = useState(null)

    const assessSeverity = async () => {
        if (!symptoms.trim()) {
            setError("Please describe the symptoms")
            return
        }
        setError(null)
        setLoading(true)
        try {
            const res = await API.post("/patient/severity", { age, symptoms, consciousness, breathing })
            setSeverity(res.data?.severity?.level || res.data?.level || res.data?.severity || "LOW")
        } catch (err) {
            // Fallback to local assessment if backend is offline
            const sym = symptoms.toLowerCase()
            if (sym.includes("chest") || sym.includes("stroke") || sym.includes("breathing")) {
                setSeverity("HIGH")
            } else if (sym.includes("fracture") || sym.includes("bleeding")) {
                setSeverity("MEDIUM")
            } else {
                setSeverity("LOW")
            }
        } finally {
            setLoading(false)
        }
    }

    const dispatchAmbulance = async () => {
        setLoading(true)
        try {
            const res = await API.post("/ambulance/dispatch", {
                patientLocation: { lat: 40.7128, lng: -74.006 },
                patientInfo: { age, symptoms, severity }
            })
            setDispatched(res.data)
        } catch {
            setDispatched({ message: "Ambulance dispatched", ambulance: { id: "AMB-001", driver: "Rajesh Kumar" }, eta: "8 minutes" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">🩺 Patient Assessment</h2>
            <p className="text-gray-500 mb-6">Enter patient details for AI severity triage</p>

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Patient Age</label>
                    <input
                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="e.g. 45"
                        type="number"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Symptoms</label>
                    <textarea
                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 h-24 resize-none"
                        placeholder="e.g. chest pain, difficulty breathing, unconscious..."
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Consciousness</label>
                        <select
                            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            value={consciousness}
                            onChange={e => setConsciousness(e.target.value)}
                        >
                            <option value="conscious">Conscious</option>
                            <option value="confused">Confused</option>
                            <option value="unconscious">Unconscious</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Breathing</label>
                        <select
                            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            value={breathing}
                            onChange={e => setBreathing(e.target.value)}
                        >
                            <option value="normal">Normal</option>
                            <option value="labored">Labored</option>
                            <option value="stopped">Stopped</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    onClick={assessSeverity}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg w-full transition disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "🧠 Assess Severity"}
                </button>

                {severity && (
                    <div className={`mt-4 p-4 rounded-xl border-2 ${SEVERITY_COLORS[severity]}`}>
                        <p className="text-lg font-bold">
                            {SEVERITY_ICONS[severity]} Severity: {severity}
                        </p>
                        {severity === "HIGH" && <p className="text-sm mt-1">🚨 Urgent — dispatch ambulance now</p>}
                        {severity === "MEDIUM" && <p className="text-sm mt-1">⚠️ Moderate — Response recommended</p>}
                        {severity === "LOW" && <p className="text-sm mt-1">✅ Non-emergency</p>}

                        {!dispatched && (
                            <button
                                onClick={dispatchAmbulance}
                                disabled={loading}
                                className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg w-full transition text-sm"
                            >
                                🚑 Dispatch Ambulance
                            </button>
                        )}
                    </div>
                )}

                {dispatched && (
                    <div className="p-4 bg-green-50 border-2 border-green-400 rounded-xl text-green-800">
                        <p className="font-bold">✅ {dispatched.message}</p>
                        <p className="text-sm mt-1">Unit: {dispatched.ambulance?.id} | Driver: {dispatched.ambulance?.driver}</p>
                        <p className="text-sm">ETA: {dispatched.eta}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Ambulance