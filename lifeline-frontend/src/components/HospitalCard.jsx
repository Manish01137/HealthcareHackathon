function HospitalCard({ hospital, index, view }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{hospital.name}</h3>
                    {hospital.score !== undefined && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Score: {Math.round(hospital.score)}
                        </span>
                    )}
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${index === 0 && view === "ranked" ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                    {index === 0 && view === "ranked" ? "⭐ Best" : `#${index + 1}`}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="bg-red-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-red-600">{hospital.icuBeds || hospital.icu || 0}</p>
                    <p className="text-xs text-gray-500">ICU Beds</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-blue-600">{hospital.ventilators || hospital.vent || 0}</p>
                    <p className="text-xs text-gray-500">Ventilators</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-green-600">{hospital.doctors || 0}</p>
                    <p className="text-xs text-gray-500">Doctors</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-yellow-600">
                        {hospital.distance !== undefined ? (hospital.distance > 1000 ? `${(hospital.distance / 1000).toFixed(1)}k` : `${Math.round(hospital.distance)}m`) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Distance</p>
                </div>
            </div>

            {hospital.reason && view === "ranked" && (
                <div className="mt-3 bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                    <p className="text-xs text-indigo-800 font-medium whitespace-pre-line">
                        ℹ️ {hospital.reason}
                    </p>
                </div>
            )}

            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                🗺️ Route to This Hospital
            </button>
        </div>
    )
}

export default HospitalCard