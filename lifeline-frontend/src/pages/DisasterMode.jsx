import { useState, useEffect } from "react"
import API from "../services/api"

function DisasterMode() {
    const [patients, setPatients] = useState([
        { id: "P1", age: 65, symptoms: "chest pain, unconscious", location: { lat: 40.7128, lng: -74.006 } },
        { id: "P2", age: 34, symptoms: "heavy bleeding from leg", location: { lat: 40.7128, lng: -74.006 } },
        { id: "P3", age: 22, symptoms: "headache, mild fever", location: { lat: 40.7128, lng: -74.006 } }
    ]);
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const distributePatients = async () => {
        setLoading(true);
        try {
            const res = await API.post("/patient/disaster", { patients });
            setResults(res.data);
        } catch (error) {
            console.error("Disaster distribution failed", error);
        } finally {
            setLoading(false);
        }
    }

    const addPatient = () => {
        setPatients([...patients, { id: `P${patients.length + 1}`, age: 30, symptoms: "", location: { lat: 40.7128, lng: -74.006 } }]);
    };

    const updatePatient = (index, field, value) => {
        const updated = [...patients];
        updated[index][field] = value;
        setPatients(updated);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-red-700">⚠️ Disaster Resource Mode</h2>
                    <p className="text-gray-600 font-medium">Auto-distribute multiple patients across hospitals dynamically</p>
                </div>
                <button
                    onClick={distributePatients}
                    disabled={loading || patients.length === 0}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 transition"
                >
                    {loading ? "Calculating Routing..." : "Distribute Patients"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Incoming Casualties</h3>
                        <button onClick={addPatient} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">+ Add Patient</button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {patients.map((p, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <div className="flex gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <span>#{p.id}</span>
                                    <span>· Age:
                                        <input type="number" value={p.age} onChange={(e) => updatePatient(i, 'age', e.target.value)} className="ml-1 w-16 border rounded px-1" />
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter full symptoms (ex: chest pain, bleeding)"
                                    value={p.symptoms}
                                    onChange={(e) => updatePatient(i, 'symptoms', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl shadow p-5 border-2 border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">AI Distribution Output</h3>

                    {!results && !loading && (
                        <div className="text-gray-400 text-center py-12">
                            Enter patients and click distribute to see capacity management plan.
                        </div>
                    )}

                    {loading && (
                        <div className="text-blue-500 font-bold text-center py-12 animate-pulse">
                            Processing triage algorithm...
                        </div>
                    )}

                    {results && (
                        <div className="space-y-4">
                            {results.map((r, i) => (
                                <div key={i} className={`rounded-xl p-4 shadow-sm border-l-4 ${r.patient.severity === "CRITICAL" ? "border-red-600 bg-red-50" : r.patient.severity === "HIGH" ? "border-orange-500 bg-orange-50" : "border-green-500 bg-green-50"}`}>
                                    <div className="flex justify-between">
                                        <span className="font-bold">🧑 Patient {r.patient.id}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${r.patient.severity === "CRITICAL" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>{r.patient.severity}</span>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-gray-800">
                                        🏥 Routing to: <span className="text-blue-700">{r.assignedHospital}</span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1 italic">
                                        Reason: {r.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DisasterMode
