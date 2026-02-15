import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, MoreHorizontal, ArrowUpDown, Trash2, X, Activity } from "lucide-react";

export default function QueuePanel({ queue, onDelete }) {
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [selectedPatient, setSelectedPatient] = useState(null);

    if (queue.length === 0) return (
        <div className="flex flex-col items-center justify-center h-48 text-cyber-muted opacity-50">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-xs">No active patients</p>
        </div>
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedQueue = [...queue].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-black/20 text-cyber-muted text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-bold border-b border-white/5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                            <div className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="p-4 font-bold border-b border-white/5">Age</th>
                        <th className="p-4 font-bold border-b border-white/5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                            <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="p-4 font-bold border-b border-white/5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('score')}>
                            <div className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="p-4 font-bold border-b border-white/5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('department')}>
                            <div className="flex items-center gap-1">Dept <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="p-4 font-bold border-b border-white/5">Details</th>
                        <th className="p-4 font-bold border-b border-white/5">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                    {sortedQueue.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 font-medium text-white cursor-pointer hover:underline hover:text-cyber-primary" onClick={() => setSelectedPatient(p)}>
                                {p.name || `ID #${p.id}`}
                            </td>
                            <td className="p-4">{p.age}</td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                    ${p.risk === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        p.risk === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${p.risk === 'High' ? 'bg-red-500' : p.risk === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                    {p.risk}
                                </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white">{p.score}</td>
                            <td className="p-4">{p.department}</td>
                            <td className="p-4 text-cyber-muted truncate max-w-[150px]">{p.reason}</td>
                            <td className="p-4">
                                <button onClick={() => onDelete(p.id)} className="text-cyber-muted hover:text-red-400 transition-colors" title="Delete Record">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Patient Details Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-cyber-card border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setSelectedPatient(null)} className="absolute top-4 right-4 text-cyber-muted hover:text-white">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-accent flex items-center justify-center text-2xl font-bold text-white">
                                    {selectedPatient.name ? selectedPatient.name[0] : '#'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedPatient.name || `ID #${selectedPatient.id}`}</h2>
                                    <div className="flex gap-3 text-sm text-cyber-muted mt-1">
                                        <span>Age: {selectedPatient.age}</span>
                                        <span>•</span>
                                        <span>ID: {selectedPatient.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-cyber-muted uppercase tracking-wider mb-1">Triage Status</p>
                                    <div className={`text-xl font-bold ${selectedPatient.risk === 'High' ? 'text-red-400' : selectedPatient.risk === 'Medium' ? 'text-orange-400' : 'text-green-400'}`}>
                                        {selectedPatient.risk} Risk (Score: {selectedPatient.score})
                                    </div>
                                    <p className="text-sm text-white mt-1">{selectedPatient.department}</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-cyber-muted uppercase tracking-wider mb-1">Complaint</p>
                                    <p className="text-white italic">"{selectedPatient.symptoms}"</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-cyber-primary mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> AI Assessment</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                        {selectedPatient.reason}
                                    </p>
                                </div>
                                {selectedPatient.deterioration_risk && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                                        <AlertTriangle className="text-red-500 w-5 h-5" />
                                        <span className="text-red-400 text-sm font-bold">High Risk of Deterioration Detected</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setSelectedPatient(null)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
