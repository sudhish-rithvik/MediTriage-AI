import { useState, useEffect, useRef } from "react";
import QueuePanel from "./QueuePanel";
import SimulationButton from "./SimulationButton";
import { Users, Activity, Clock, Stethoscope, AlertCircle, TrendingUp } from "lucide-react";

export default function Dashboard({ newPatient }) {
    const [queue, setQueue] = useState([]);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${message}`]);
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
            addLog(`New Patient Intake: ${newPatient.risk} Risk detected.`);
        }
    }, [newPatient]);

    // KPI Calculations
    const criticalCount = queue.filter(p => p.risk === 'High').length;
    const avgScore = queue.length > 0 ? Math.round(queue.reduce((acc, p) => acc + p.score, 0) / queue.length) : 0;

    return (
        <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard icon={<Users className="text-teal-600" />} title="No. of Patients" value={queue.length} sub="Total Active" />
                <KPICard icon={<AlertCircle className="text-red-500" />} title="Critical Cases" value={criticalCount} sub="Immediate Attention" />
                <KPICard icon={<Activity className="text-blue-500" />} title="Avg Acuity Score" value={avgScore} sub="Patient Severity" />
                <KPICard icon={<Stethoscope className="text-purple-500" />} title="Active Staff" value="12" sub="Doctors on Duty" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6 h-[600px]">
                {/* Left: Queue Table (8 cols) */}
                <div className="col-span-12 lg:col-span-9 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-teal-50/50">
                        <h2 className="font-serif font-bold text-slate-700 text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-teal-600" /> Live Patient Queue
                        </h2>
                        <SimulationButton setQueue={setQueue} addLog={addLog} />
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <QueuePanel queue={queue} />
                    </div>
                </div>

                {/* Right: Analytics & Logs (4 cols) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">

                    {/* Risk Distribution Chart (Visual Only CSS) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-grow">
                        <h3 className="font-bold text-slate-600 text-sm mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Risk Distribution
                        </h3>
                        <div className="flex items-end h-40 gap-2 mb-4">
                            <div className="w-1/3 bg-red-100 rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-red-500 rounded-t transition-all duration-500" style={{ height: `${(criticalCount / (queue.length || 1)) * 100}%` }}></div>
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600">{criticalCount}</span>
                            </div>
                            <div className="w-1/3 bg-orange-100 rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-orange-500 rounded-t transition-all duration-500" style={{ height: `${(queue.filter(p => p.risk === 'Medium').length / (queue.length || 1)) * 100}%` }}></div>
                            </div>
                            <div className="w-1/3 bg-green-100 rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-green-500 rounded-t transition-all duration-500" style={{ height: `${(queue.filter(p => p.risk === 'Low').length / (queue.length || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Mini System Log */}
                    <div className="bg-slate-900 text-teal-400 p-4 rounded-xl shadow-inner font-mono text-xs h-40 overflow-hidden flex flex-col">
                        <div className="flex-grow overflow-y-auto space-y-1 scrollbar-hide">
                            {logs.map((log, i) => (
                                <div key={i} className="opacity-80 border-l-2 border-teal-800 pl-2">
                                    {log}
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, title, value, sub }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-full border border-slate-100">
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-sm font-medium text-slate-500">{title}</div>
                <div className="text-xs text-slate-400 mt-1">{sub}</div>
            </div>
        </div>
    )
}
