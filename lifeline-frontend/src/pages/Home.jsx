import { Link } from "react-router-dom"

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
            <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-4">

                <div className="text-7xl mb-6">🚑</div>

                <h1 className="text-5xl font-extrabold text-red-600 mb-4">
                    LifeLineAI
                </h1>
                <p className="text-2xl text-gray-600 font-medium mb-2">
                    AI-Powered Emergency Response System
                </p>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                    Smart ambulance triage, real-time hospital routing, and crowd-clearing alerts — all in one platform.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">

                    <Link to="/ambulance" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:-translate-y-1 border border-red-100">
                        <div className="text-4xl mb-3">🩺</div>
                        <h3 className="font-bold text-gray-800 text-lg">Patient Triage</h3>
                        <p className="text-sm text-gray-500 mt-1">AI severity assessment in seconds</p>
                    </Link>

                    <Link to="/hospitals" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:-translate-y-1 border border-blue-100">
                        <div className="text-4xl mb-3">🏥</div>
                        <h3 className="font-bold text-gray-800 text-lg">Hospital Routing</h3>
                        <p className="text-sm text-gray-500 mt-1">Find the best hospital by capacity</p>
                    </Link>

                    <Link to="/map" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:-translate-y-1 border border-green-100">
                        <div className="text-4xl mb-3">🗺️</div>
                        <h3 className="font-bold text-gray-800 text-lg">Live Tracking</h3>
                        <p className="text-sm text-gray-500 mt-1">Real-time ambulance map</p>
                    </Link>

                </div>

                <div className="mt-10 flex gap-4 justify-center flex-wrap">
                    <Link to="/alerts" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition">
                        🚨 Activate Crowd Alert
                    </Link>
                    <Link to="/hospital-panel" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                        🏥 Hospital Panel
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Home