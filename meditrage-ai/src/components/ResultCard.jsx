export default function ResultCard({ result }) {
    if (!result) return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 h-full flex flex-col items-center justify-center text-slate-400">
            <div className="text-6xl mb-4">🩺</div>
            <p className="text-lg">Waiting for patient data...</p>
        </div>
    );

    const riskStyles =
        result.risk === "High" ? { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "🚨" } :
            result.risk === "Medium" ? { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "⚠️" } :
                { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "✅" };

    // Predictive Logic: High Risk + High Score = Fast Deterioration
    let deteriorationMsg = null;
    if (result.deteriorationRisk) {
        if (result.risk === "High" && result.score > 85) {
            deteriorationMsg = "Likely critical in < 15 mins";
        } else if (result.risk === "High") {
            deteriorationMsg = "Likely critical in 30 mins";
        } else {
            deteriorationMsg = "Monitor closely for changes";
        }
    }

    return (
        <div className={`p-8 rounded-xl shadow-lg border-2 h-full flex flex-col ${riskStyles.bg} ${riskStyles.border}`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-4xl mb-2">{riskStyles.icon}</div>
                    <h2 className={`text-4xl font-extrabold uppercase tracking-tight ${riskStyles.text}`}>{result.risk} RISK</h2>
                    <p className="text-slate-600 font-medium text-lg mt-1">
                        Recommended: <span className="font-bold">{result.department}</span>
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-6xl font-black text-slate-800">{result.score}</div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Triage Score</p>
                </div>
            </div>

            <div className="bg-white/60 p-6 rounded-lg border border-slate-200 backdrop-blur-sm flex-grow">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Reasoning</h3>
                <p className="text-slate-800 text-lg leading-relaxed font-medium">
                    {result.reason}
                </p>
            </div>

            {result.deteriorationRisk && (
                <div className="mt-6 bg-red-100 border-2 border-red-500 p-4 rounded-lg flex items-center gap-4 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <div className="text-3xl">📉</div>
                    <div>
                        <h4 className="font-black text-red-900 uppercase tracking-wide">Deterioration Warning</h4>
                        <p className="text-lg font-bold text-red-700">{deteriorationMsg}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
