import { useState, useEffect, useRef } from "react";
import QueuePanel from "./QueuePanel";
import SimulationButton from "./SimulationButton";
import { Users, Activity, Clock, Stethoscope, AlertCircle, TrendingUp, MoreHorizontal } from "lucide-react";

export default function Dashboard({ newPatient }) {
    const [queue, setQueue] = useState([]);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    useEffect(() => {
        if (newPatient) {
            setQueue(prev => {
                const updated = [...prev, { ...newPatient, id: Date.now() }];
                return updated.sort((a, b) => b.score - a.score);
            });
            // Use name if available, else ID
            const pName = newPatient.name ? newPatient.name : `ID #${Date.now().toString().slice(-4)}`;
            addLog(`New Patient Intake: ${pName} - ${newPatient.risk} Risk`);
        }
    }, [newPatient]);

    const criticalCount = queue.filter(p => p.risk === 'High').length;
    // Calculate Avg Score if needed, otherwise just keep it
    const avgScore = queue.length > 0 ? Math.round(queue.reduce((acc, p) => acc + p.score, 0) / queue.length) : 0;

    // Analytics Data
    const riskCounts = {
        High: queue.filter(p => p.risk === 'High').length,
        Medium: queue.filter(p => p.risk === 'Medium').length,
        Low: queue.filter(p => p.risk === 'Low').length
    };
    const total = queue.length || 1; // avoid divide by zero

    const getHeight = (count) => `${Math.max((count / total) * 100, 5)}%`;

    return (
        <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Gradient Card */}
                <div className="bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-2xl p-6 text-white shadow-lg shadow-cyber-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50"><MoreHorizontal /></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-sm font-medium opacity-90 mb-1">Total Patients</h3>
                    <div className="text-3xl font-bold mb-2">{queue.length}</div>
                </div>

                <KPICard icon={<AlertCircle className="text-cyber-accent" />} title="Critical Cases" value={criticalCount} sub="-5% vs yesterday" />
                <KPICard icon={<Activity className="text-cyber-primary" />} title="Avg Acuity Score" value={avgScore} sub="Stable" />
                {/* Removed Active Staff Card */}
            </div>

            {/* Analytic Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-cyber-card rounded-2xl p-6 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">Analytics Overview</h3>
                        <div className="flex gap-2">
                            <span className="text-xs text-cyber-muted">Patient Count by Risk Level</span>
                        </div>
                    </div>

                    {/* Real Analytics Chart (Bar Chart for Risk Levels) */}
                    <div className="h-64 w-full flex items-end justify-around px-10 gap-8">
                        {/* Low Risk Bar */}
                        <div className="w-24 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-green-500/20 rounded-t-xl relative hover:bg-green-500/30 transition-all duration-500" style={{ height: `${(riskCounts.Low / total) * 100}%`, minHeight: '10%' }}>
                                <div className="absolute top-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] rounded-full"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{riskCounts.Low}</div>
                            </div>
                            <span className="text-cyber-muted text-xs font-bold uppercase">Low</span>
                        </div>

                        {/* Medium Risk Bar */}
                        <div className="w-24 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-orange-500/20 rounded-t-xl relative hover:bg-orange-500/30 transition-all duration-500" style={{ height: `${(riskCounts.Medium / total) * 100}%`, minHeight: '10%' }}>
                                <div className="absolute top-0 w-full h-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] rounded-full"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{riskCounts.Medium}</div>
                            </div>
                            <span className="text-cyber-muted text-xs font-bold uppercase">Medium</span>
                        </div>

                        {/* High Risk Bar */}
                        <div className="w-24 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-red-500/20 rounded-t-xl relative hover:bg-red-500/30 transition-all duration-500" style={{ height: `${(riskCounts.High / total) * 100}%`, minHeight: '10%' }}>
                                <div className="absolute top-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] rounded-full"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{riskCounts.High}</div>
                            </div>
                            <span className="text-cyber-muted text-xs font-bold uppercase">High</span>
                        </div>
                    </div>
                </div>

                {/* System Log */}
                <div className="bg-cyber-card rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col h-[350px]">
                    <h3 className="font-bold text-white text-lg mb-4">System Terminal</h3>
                    <div className="flex-grow overflow-y-auto space-y-2 font-mono text-xs text-cyber-muted scrollbar-hide">
                        {logs.length === 0 && <span className="opacity-30">Waiting for simulation...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="border-l-2 border-cyber-primary pl-3 py-1 break-words">
                                <span className="text-cyber-accent mr-2">{">"}</span>{log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>
            </div>

            {/* Queue Summary (Moved to Patients Tab) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyber-card rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-cyber-primary/20 rounded-full mb-4">
                        <Users className="w-8 h-8 text-cyber-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Patient Registry</h3>
                    <p className="text-cyber-muted text-sm mb-4">View detailed list and manage triage status.</p>
                    <button className="text-cyber-accent font-bold text-sm hover:underline">Go to Patients &rarr;</button>
                </div>
                <div className="bg-cyber-card rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-cyber-accent/20 rounded-full mb-4">
                        <Clock className="w-8 h-8 text-cyber-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Wait Times</h3>
                    <p className="text-cyber-muted text-sm">Avg Wait: <span className="text-white font-bold">12 mins</span></p>
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, title, value, sub }) {
    return (
        <div className="bg-cyber-card rounded-2xl p-6 border border-white/5 relative group hover:border-cyber-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black/30 rounded-xl text-white">
                    {icon}
                </div>
                <button className="text-cyber-muted hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <h3 className="text-sm font-medium text-cyber-muted mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-cyber-primary transition-colors">{value}</div>
            <div className="text-xs text-cyber-muted">{sub}</div>
        </div>
    )
}
