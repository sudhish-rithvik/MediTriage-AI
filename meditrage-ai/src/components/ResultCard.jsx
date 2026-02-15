import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function ResultCard({ result }) {
    if (!result) return null;

    const isHighRisk = result.risk === 'High';
    const borderColor = isHighRisk ? 'border-cyber-primary' : result.risk === 'Medium' ? 'border-orange-500' : 'border-green-500';
    const glowColor = isHighRisk ? 'shadow-[0_0_30px_rgba(124,58,237,0.3)]' : '';

    return (
        <div className={`relative bg-cyber-card rounded-2xl p-6 border ${borderColor} ${glowColor} transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
            {/* Deterioration Warning Overlay */}
            {result.deteriorationRisk && (
                <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse-red rounded-2xl pointer-events-none"></div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-cyber-muted text-xs font-bold uppercase tracking-widest mb-1">Analysis Result</h2>
                        <div className={`text-3xl font-bold flex items-center gap-2 ${isHighRisk ? 'text-cyber-primary' : 'text-white'}`}>
                            {result.risk} Risk
                        </div>
                        <div className="text-cyber-muted text-sm">{result.department}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-bold text-white tracking-tighter">{result.score}</div>
                        <div className="text-xs text-cyber-muted uppercase tracking-wide">Score</div>
                    </div>
                </div>

                <div className="bg-black/40 p-4 rounded-xl mb-4 border border-white/5 backdrop-blur-sm">
                    <h3 className="text-xs font-bold uppercase text-cyber-muted mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyber-primary"></span> AI Reasoning
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-300 font-medium">
                        {result.reason}
                    </p>
                </div>

                {result.deteriorationRisk && (
                    <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-red-400 w-5 h-5" />
                        <div>
                            <h4 className="font-bold text-red-200 text-sm">Rapid Deterioration Detected</h4>
                            <p className="text-xs text-red-300/80">Monitor vitals closely. Critical within 15m.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
