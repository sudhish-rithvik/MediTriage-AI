import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function QueuePanel({ queue }) {
    if (queue.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p>No active patients in queue</p>
        </div>
    );

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-teal-600 text-white text-sm uppercase tracking-wider sticky top-0 z-10">
                <tr>
                    <th className="p-4 font-semibold">Risk Status</th>
                    <th className="p-4 font-semibold">Acuity</th>
                    <th className="p-4 font-semibold">Department</th>
                    <th className="p-4 font-semibold">Clinical Indicator</th>
                    <th className="p-4 font-semibold">Trend</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {queue.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group cursor-default">
                        <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                ${p.risk === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                    p.risk === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {p.risk === 'High' && <AlertTriangle className="w-3 h-3" />}
                                {p.risk === 'Low' && <CheckCircle className="w-3 h-3" />}
                                {p.risk}
                            </span>
                        </td>
                        <td className="p-4 font-bold font-mono text-slate-900">{p.score}</td>
                        <td className="p-4">{p.department}</td>
                        <td className="p-4 text-slate-500 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:relative">
                            <span className="group-hover:absolute group-hover:bg-white group-hover:p-2 group-hover:shadow-lg group-hover:border group-hover:border-slate-200 group-hover:rounded group-hover:z-20 group-hover:left-4 group-hover:-top-2 w-max max-w-sm">
                                {p.reason}
                            </span>
                            <span className="block truncate">{p.reason}</span>
                        </td>
                        <td className="p-4">
                            {p.deteriorationRisk ? (
                                <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    UNSTABLE
                                </div>
                            ) : (
                                <span className="text-slate-400 text-xs">Stable</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
