import { useState } from "react";
import PatientForm from "./components/PatientForm";
import ResultCard from "./components/ResultCard";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">
            Healthcare Administration Analysis
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time Emergency Department KPIs & Triage</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Current Session</div>
          <div className="text-xl font-mono font-bold text-teal-600">{new Date().getFullYear()}</div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Intake & Result (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PatientForm onResult={setResult} />
          {result && <ResultCard result={result} />}
        </div>

        {/* Right Column: Dashboard & Analytics (8 cols) */}
        <div className="col-span-12 lg:col-span-8">
          <Dashboard newPatient={result} />
        </div>
      </div>
    </div>
  )
}
