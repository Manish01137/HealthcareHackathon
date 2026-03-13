import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Ambulance from "./pages/Ambulance"
import Hospitals from "./pages/Hospitals"
import LiveMap from "./pages/LiveMap"
import HospitalPanel from "./pages/HospitalPanel"
import Alert from "./pages/Alert"
import DisasterMode from "./pages/DisasterMode"
import AmbulanceDashboard from "./pages/AmbulanceDashboard"

function App() {
    const [globalAlert, setGlobalAlert] = useState(null);

    useEffect(() => {
        // Listen to global socket for geofence alert (mocking user location as NYC Center for this project)
        const userLocation = { lat: 40.7128, lng: -74.0060 }; // Mock user in Manhattan
        const socketURL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
        const socket = io(socketURL); // Match dynamic backend Port

        socket.on("ambulanceLocationUpdate", (amb) => {
            if (amb.status === "en-route") {
                // simple quick distance check (Pythagorean for demo approximation, or use geolib if imported)
                // 1 degree lat/lng is approx 111km. 500m is roughly 0.0045 degrees.
                const latDiff = Math.abs(amb.lat - userLocation.lat);
                const lngDiff = Math.abs(amb.lng - userLocation.lng);

                if (latDiff < 0.005 && lngDiff < 0.005) {
                    setGlobalAlert({
                        id: amb.id,
                        distance: "less than 500m",
                        eta: amb.eta || "approaching quickly"
                    });

                    // Auto clear after 10s
                    setTimeout(() => setGlobalAlert(null), 10000);
                }
            }
        });

        return () => socket.disconnect();
    }, []);

    return (
        <BrowserRouter>
            <Navbar />

            {/* Global Dynamic Geofence Banner */}
            {globalAlert && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] animate-bounce w-11/12 max-w-lg border-2 border-red-800 flex items-center gap-4">
                    <span className="text-4xl animate-pulse">🚨</span>
                    <div>
                        <h3 className="font-extrabold text-lg uppercase">Emergency Vehicle Approaching</h3>
                        <p className="text-sm font-medium mt-1">
                            🚑 {globalAlert.id} is {globalAlert.distance} away (ETA: {globalAlert.eta}).
                        </p>
                        <p className="font-bold text-yellow-300 mt-1 uppercase tracking-wide">Please clear the road immediately.</p>
                    </div>
                    <button onClick={() => setGlobalAlert(null)} className="ml-auto bg-red-800 hover:bg-red-900 rounded p-2 text-xs font-bold">Close</button>
                </div>
            )}

            <div className="p-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ambulance" element={<Ambulance />} />
                    <Route path="/hospitals" element={<Hospitals />} />
                    <Route path="/map" element={<LiveMap />} />
                    <Route path="/dashboard" element={<AmbulanceDashboard />} />
                    <Route path="/disaster" element={<DisasterMode />} />
                    <Route path="/hospital-panel" element={<HospitalPanel />} />
                    <Route path="/alerts" element={<Alert />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App