import { useState, useEffect } from "react";
import PatientForm from "./components/PatientForm";
import ResultCard from "./components/ResultCard";
import Dashboard from "./components/Dashboard";
import PatientsView from "./components/PatientsView";
import DoctorsView from "./components/DoctorsView";
import Sidebar from "./components/Sidebar";
import { Search, Bell, User } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [result, setResult] = useState(null);
  const [queue, setQueue] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  // Fetch initial data & subscribe
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from('patients').select('*').order('score', { ascending: false });
      if (data) setQueue(data);
    };
    fetchPatients();

    const subscription = supabase
      .channel('patients')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'patients' }, (payload) => {
        setQueue(prev => [payload.new, ...prev]);
        addLog(`New Patient: ${payload.new.name} - ${payload.new.risk}`);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const handleNewPatient = async (patient) => {
    setResult(patient);

    // Save to Supabase
    const { error } = await supabase.from('patients').insert([
      {
        name: patient.name || "Unknown",
        age: patient.age,
        risk: patient.risk,
        score: patient.score, // Ensure this is int
        department: patient.department,
        symptoms: patient.symptoms,
        status: "Waiting",
        reason: patient.reason,
        deterioration_risk: patient.deteriorationRisk
      }
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      addLog(`Error saving: ${error.message}`);
    }
    // Note: Real-time subscription will update the queue UI
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text font-sans flex">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold capitalize">{currentView}</h1>
            <p className="text-cyber-muted text-sm">MediTriage v2.0 • System Online</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
              <input type="text" placeholder="Search..." className="bg-cyber-card border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyber-primary w-64 text-white placeholder-gray-500" />
            </div>
            <button className="p-2 bg-cyber-card rounded-full border border-white/10 hover:bg-white/5"><Bell className="w-5 h-5 text-cyber-muted" /></button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyber-primary to-cyber-accent p-[2px]">
              <div className="w-full h-full rounded-full bg-cyber-card flex items-center justify-center">
                <div className="text-white font-bold">JD</div>
              </div>
            </div>
          </div>
        </header>

        {/* View Switcher */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Intake (3 cols) */}
            <div className="col-span-12 xl:col-span-3 space-y-6">
              <PatientForm onResult={handleNewPatient} />
              {result && <ResultCard result={result} />}
            </div>
            {/* Right Column: Analytics (9 cols) */}
            <div className="col-span-12 xl:col-span-9">
              <Dashboard queue={queue} logs={logs} />
            </div>
          </div>
        )}

        {currentView === 'patients' && (
          <PatientsView queue={queue} setQueue={setQueue} addLog={addLog} />
        )}

        {currentView === 'doctors' && (
          <DoctorsView />
        )}

        {currentView === 'settings' && (
          <div className="p-10 text-center text-cyber-muted">Settings Panel Coming Soon...</div>
        )}

      </div>
    </div>
  )
}
