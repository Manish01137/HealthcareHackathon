import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import API from "../services/api"
import { io } from "socket.io-client"

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const ambulanceIcon = new L.Icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

const hospitalIcon = new L.Icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

const MOCK_AMBULANCES = [
    { id: "AMB-001", driver: "Rajesh Kumar", status: "en-route", lat: 40.7128, lng: -74.006, selectedHospitalId: 1, eta: "Calculatiing..." },
    { id: "AMB-002", driver: "Priya Sharma", status: "available", lat: 40.7282, lng: -73.994, eta: "N/A" },
]

function LiveMap() {
    const [ambulances, setAmbulances] = useState(MOCK_AMBULANCES)
    const [hospitals, setHospitals] = useState([])
    const [lastUpdated, setLastUpdated] = useState(new Date())
    const [routes, setRoutes] = useState({}) // Store fetched route polylines by ambulance ID

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await API.get("/hospitals");
                setHospitals(res.data);
            } catch {
                setHospitals([
                    { id: 1, name: "Bellevue Hospital", lat: 40.739, lng: -73.975 },
                    { id: 2, name: "Mount Sinai", lat: 40.790, lng: -73.953 },
                ]);
            }
        };
        fetchHospitals();
    }, []);

    // WebSocket real-time updates & mock polling fallback
    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("connect", () => console.log("Connected to ambulance tracking socket"));
        socket.on("ambulanceLocationUpdate", (data) => {
            setAmbulances(prev => {
                const updated = prev.map(a => a.id === data.id ? { ...a, lat: data.lat, lng: data.lng, status: data.status || a.status } : a)
                if (!prev.find(a => a.id === data.id)) updated.push(data)
                return updated
            })
            setLastUpdated(new Date());
        });

        const fetchAmbulances = async () => {
            try {
                const res = await API.get("/ambulance")
                setAmbulances(res.data)
                setLastUpdated(new Date())
            } catch {
                // Keep mock data - animating slightly for "live tracking" feel
                setAmbulances(prev => prev.map(a => ({
                    ...a,
                    lat: a.status === "en-route" ? a.lat + (Math.random() * 0.0004 - 0.0002) : a.lat,
                    lng: a.status === "en-route" ? a.lng + (Math.random() * 0.0004 - 0.0002) : a.lng
                })))
                setLastUpdated(new Date())
            }
        }

        fetchAmbulances()
        const interval = setInterval(fetchAmbulances, 4000)

        return () => {
            clearInterval(interval);
            socket.disconnect();
        }
    }, [])

    // Route Optimization using OSRM fetching
    useEffect(() => {
        ambulances.forEach(async (amb) => {
            if (amb.selectedHospitalId && amb.status === "en-route") {
                const targetHosp = hospitals.find(h => h.id === amb.selectedHospitalId);
                if (targetHosp) {
                    try {
                        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${amb.lng},${amb.lat};${targetHosp.lng},${targetHosp.lat}?overview=full&geometries=geojson`);
                        const data = await response.json();

                        if (data && data.routes && data.routes[0]) {
                            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // Swap lng,lat to lat,lng
                            const durationSeconds = data.routes[0].duration;
                            const etaMins = Math.ceil(durationSeconds / 60);

                            setRoutes(prev => ({ ...prev, [amb.id]: coords }));

                            // Update ETA safely directly in state
                            setAmbulances(prev => prev.map(a => a.id === amb.id ? { ...a, eta: `${etaMins} mins` } : a));
                        }
                    } catch (e) {
                        console.log("OSRM route fetch failed", e);
                    }
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambulances, hospitals]) // Update routes slowly tracking movement

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">🗺️ Live AI Navigation</h2>
                    <p className="text-sm text-gray-400">
                        Updated: {lastUpdated.toLocaleTimeString()} · Real-time OSRM optimized routes
                    </p>
                </div>
                <div className="flex gap-3 text-sm">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> Ambulance</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> Hospital</span>
                </div>
            </div>

            <MapContainer
                center={[40.7128, -74.006]}
                zoom={13}
                className="rounded-2xl shadow-lg border border-gray-200"
                style={{ height: "60vh", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />

                {ambulances.map(amb => (
                    <Marker key={amb.id} position={[amb.lat, amb.lng]} icon={ambulanceIcon} >
                        {/* Marker transitions could be added if react-leaflet supports CSS transition on markers */}
                        <Popup>
                            <strong>🚑 {amb.id}</strong><br />
                            Driver: {amb.driver}<br />
                            ETA: {amb.eta}<br />
                            Status: <span className={amb.status === "en-route" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>{amb.status}</span>
                        </Popup>
                    </Marker>
                ))}

                {hospitals.map((h, i) => (
                    <Marker key={h.id || i} position={[h.lat, h.lng]} icon={hospitalIcon}>
                        <Popup>
                            <strong>🏥 {h.name}</strong>
                        </Popup>
                    </Marker>
                ))}

                {/* Draw OSRM Fetched Exact Route */}
                {ambulances.map(amb => {
                    if (amb.selectedHospitalId && amb.status === "en-route" && routes[amb.id]) {
                        return (
                            <Polyline
                                key={`route-${amb.id}`}
                                positions={routes[amb.id]}
                                color="#2563EB"
                                weight={5}
                                opacity={0.7}
                            />
                        )
                    } else if (amb.selectedHospitalId && amb.status === "en-route") {
                        // Fallback straight line
                        const targetHosp = hospitals.find(h => h.id === amb.selectedHospitalId);
                        if (targetHosp) return <Polyline key={`dash-${amb.id}`} positions={[[amb.lat, amb.lng], [targetHosp.lat, targetHosp.lng]]} color="blue" dashArray="5, 10" weight={2} />
                    }
                    return null;
                })}
            </MapContainer>

            <div className="mt-6 mb-2">
                <h3 className="text-xl font-bold text-gray-800">Unit Telemetry</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ambulances.map(amb => (
                    <div key={amb.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${amb.status === "en-route" ? "border-red-500" : "border-gray-300"}`}>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-gray-800">{amb.id}</p>
                            <span className={`text-[10px] font-bold px-2 py-1 uppercase rounded-full tracking-wide ${amb.status === "en-route" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                                {amb.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">👨‍✈️ {amb.driver}</p>
                        {amb.status === "en-route" && amb.selectedHospitalId && (
                            <div className="mt-2 bg-blue-50 p-2 rounded">
                                <p className="text-xs text-blue-700 font-medium">📍 Routing to Hosp #{amb.selectedHospitalId}</p>
                                <p className="text-sm text-blue-800 font-bold mt-1">⏳ ETA: {amb.eta}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LiveMap