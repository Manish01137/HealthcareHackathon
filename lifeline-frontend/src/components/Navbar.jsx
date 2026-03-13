import { Link, useLocation } from "react-router-dom"

const links = [
    { to: "/", label: "🏠 Home" },
    { to: "/ambulance", label: "🩺 Triage" },
    { to: "/hospitals", label: "🏥 Hospitals" },
    { to: "/dashboard", label: "🚑 Dashboard" },
    { to: "/disaster", label: "⚠️ Disaster" },
    { to: "/map", label: "🗺️ Map" },
    { to: "/hospital-panel", label: "📋 Panel" },
    { to: "/alerts", label: "🚨 Alerts" },
]

function Navbar() {
    const location = useLocation()

    return (
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🚑</span>
                <h1 className="text-xl font-extrabold text-red-600 tracking-tight">LifeLineAI</h1>
            </Link>

            <nav className="flex gap-1">
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${location.pathname === link.to
                            ? "bg-red-50 text-red-600"
                            : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Navbar