const SEVERITY_STYLES = {
    Critical: { bg: "bg-red-100", border: "border-red-500", text: "text-red-700", icon: "🔴" },
    High: { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-700", icon: "🟠" },
    Moderate: { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-700", icon: "🟡" },
    Low: { bg: "bg-green-100", border: "border-green-500", text: "text-green-700", icon: "🟢" },
}

const SEVERITY_DESC = {
    Critical: "Immediate life-threatening — dispatch now",
    High: "Urgent care required within minutes",
    Moderate: "Needs attention — monitor constantly",
    Low: "Stable — non-emergency transport",
}

function SeverityCard({ severity }) {
    if (!severity) return null

    const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.Low
    const desc = SEVERITY_DESC[severity] || ""

    return (
        <div className={`p-4 rounded-xl border-2 ${style.bg} ${style.border} ${style.text}`}>
            <p className="text-xl font-bold">{style.icon} Severity: {severity}</p>
            <p className="text-sm mt-1 opacity-80">{desc}</p>
        </div>
    )
}

export default SeverityCard
