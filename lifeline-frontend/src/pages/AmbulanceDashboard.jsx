import { useState, useEffect } from "react"
import API from "../services/api"

function AmbulanceDashboard() {

    const [ambulances, setAmbulances] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [loading, setLoading] = useState(true)

    // Emergency assessment states
    const [age, setAge] = useState("")
    const [injuryType, setInjuryType] = useState("")
    const [symptoms, setSymptoms] = useState("")
    const [heartRate, setHeartRate] = useState("")
    const [spo2, setSpo2] = useState("")
    const [systolicBP, setSystolicBP] = useState("")
    const [diastolicBP, setDiastolicBP] = useState("")
    const [severityResult, setSeverityResult] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ambRes, hospRes] = await Promise.all([
                    API.get("/ambulance"),
                    API.get("/hospitals")
                ]);
                setAmbulances(ambRes.data)
                setHospitals(hospRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const intv = setInterval(fetchData, 8000)
        return () => clearInterval(intv)
    }, [])

    // Submit emergency assessment
    const handleAssess = async () => {
        try {

            const payload = {
                age,
                injuryType,
                symptoms,
                heartRate,
                spo2,
                systolicBP,
                diastolicBP
            }

            const res = await API.post("/patients/evaluate", payload)

            setSeverityResult(res.data.severity)

        } catch (err) {
            console.error(err)
        }
    }

    // Voice dictation
    const startVoice = () => {

        if (!("webkitSpeechRecognition" in window)) {
            alert("Voice recognition not supported")
            return
        }

        const recognition = new window.webkitSpeechRecognition()

        recognition.lang = "en-US"

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript
            setSymptoms(text)
        }

        recognition.start()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">

            {/* Emergency Assessment */}
            <div className="bg-white rounded-3xl shadow-xl border p-8">

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    🚑 Emergency Assessment
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <input
                        placeholder="Patient Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="border rounded-lg p-3"
                    />

                    <select
                        value={injuryType}
                        onChange={(e) => setInjuryType(e.target.value)}
                        className="border rounded-lg p-3"
                    >
                        <option value="">Select Injury</option>
                        <option value="cardiac">Cardiac</option>
                        <option value="trauma">Trauma</option>
                        <option value="stroke">Stroke</option>
                    </select>

                    <textarea
                        placeholder="Symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="border rounded-lg p-3 md:col-span-2"
                    />

                    <input
                        placeholder="Heart Rate"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="SpO2"
                        value={spo2}
                        onChange={(e) => setSpo2(e.target.value)}
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="Systolic BP"
                        value={systolicBP}
                        onChange={(e) => setSystolicBP(e.target.value)}
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="Diastolic BP"
                        value={diastolicBP}
                        onChange={(e) => setDiastolicBP(e.target.value)}
                        className="border rounded-lg p-3"
                    >

                    </input>

                </div>

                <div className="flex gap-4 mt-6">

                    <button
                        onClick={startVoice}
                        className="bg-gray-800 text-white px-5 py-2 rounded-lg"
                    >
                        🎤 Voice Input
                    </button>

                    <button
                        onClick={handleAssess}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                        Assess Severity
                    </button>

                </div>

                {severityResult && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

                        <h3 className="font-bold text-red-800 mb-2">
                            AI Assessment Result
                        </h3>

                        <p className="text-lg font-bold">
                            Severity Level: {severityResult.level}
                        </p>

                        <p className="text-sm text-gray-600">
                            Priority Score: {severityResult.score}
                        </p>

                    </div>
                )}

            </div>

            {/* Existing Dashboard */}
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
                🚑 Active Unit Dashboard
            </h2>

            {loading ? (
                <div className="text-center py-12 text-gray-400">
                    Loading active fleets...
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                    {ambulances.map(amb => {

                        const hosp = hospitals.find(h => h.id === amb.selectedHospitalId)

                        const patientSeverity =
                            amb.status === "en-route"
                                ? (amb.id === "AMB-001" ? "CRITICAL" : "HIGH")
                                : "NONE"

                        const eta = amb.status === "en-route" ? "8 mins" : "N/A"
                        const distance = amb.status === "en-route" ? "1.2 km" : "N/A"

                        return (

                            <div key={amb.id} className="bg-white rounded-3xl shadow-lg border">

                                <div className={`px-6 py-4 text-white flex justify-between items-center ${amb.status === "en-route"
                                        ? "bg-red-600"
                                        : "bg-green-600"
                                    }`}>

                                    <div>
                                        <h3 className="text-2xl font-bold">{amb.id}</h3>
                                        <p className="text-sm uppercase">{amb.status}</p>
                                    </div>

                                    <p className="font-bold text-sm">👨‍✈️ {amb.driver}</p>

                                </div>

                                <div className="p-6">

                                    {amb.status === "en-route" && hosp ? (

                                        <div className="bg-blue-50 border rounded-xl p-4">

                                            <h4 className="font-bold text-blue-900 mb-2">
                                                📍 Target Facility
                                            </h4>

                                            <p className="font-bold">{hosp.name}</p>

                                            <div className="grid grid-cols-2 gap-2 text-center mt-3">

                                                <div className="bg-white p-2 rounded-lg">
                                                    <p className="font-bold text-red-600">
                                                        {hosp.icuBeds || 0}
                                                    </p>
                                                    <p className="text-xs">ICU Beds</p>
                                                </div>

                                                <div className="bg-white p-2 rounded-lg">
                                                    <p className="font-bold text-green-600">
                                                        {hosp.ventilators || 0}
                                                    </p>
                                                    <p className="text-xs">Ventilators</p>
                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="bg-green-50 rounded-xl p-6 text-center">
                                            <p className="font-bold text-green-800">
                                                Available for Dispatch
                                            </p>
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