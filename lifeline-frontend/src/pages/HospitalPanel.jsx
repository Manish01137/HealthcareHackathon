/* HospitalPanel page — separate from Hospitals list page */
import { useState } from "react"

const MOCK_ICU = 12
const MOCK_VENT = 8
const MOCK_DOCTORS = 5

function HospitalPanel() {

    const [icu, setIcu] = useState(MOCK_ICU)
    const [vent, setVent] = useState(MOCK_VENT)
    const [doctors, setDoctors] = useState(MOCK_DOCTORS)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">🏥 Hospital Resource Panel</h2>
            <p className="text-gray-500 mb-6">Update live resource availability for triage routing.</p>

            <div className="bg-white rounded-xl shadow p-6 space-y-5">

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">🛏 ICU Beds Available</label>
                    <input
                        type="number"
                        value={icu}
                        min={0}
                        onChange={e => setIcu(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">💨 Ventilators Available</label>
                    <input
                        type="number"
                        value={vent}
                        min={0}
                        onChange={e => setVent(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">👨‍⚕️ Doctors On Duty</label>
                    <input
                        type="number"
                        value={doctors}
                        min={0}
                        onChange={e => setDoctors(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    {saved ? "✅ Saved!" : "Save Resource Update"}
                </button>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p><strong>Current Status:</strong> ICU: {icu} | Ventilators: {vent} | Doctors: {doctors}</p>
                </div>
            </div>
        </div>
    )
}

export default HospitalPanel
