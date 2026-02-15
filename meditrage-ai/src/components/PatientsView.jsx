import { useState, useEffect } from "react";
import QueuePanel from "./QueuePanel";
import SimulationButton from "./SimulationButton";
import { Users, Search, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function PatientsView({ queue, setQueue, addLog }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient record?")) return;

        const { error } = await supabase.from('patients').delete().eq('id', id);

        if (error) {
            console.error("Delete Error:", error);
            addLog(`Error deleting patient: ${error.message}`);
        } else {
            // Optimistic update
            setQueue(prev => prev.filter(p => p.id !== id));
            addLog(`Patient record deleted (ID: ${id})`);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("WARNING: This will delete ALL patient records. Are you sure?")) return;

        // In Supabase, delete without filter deletes all rows, but good to be explicit with neq 0 just in case of RLS or policies
        const { error } = await supabase.from('patients').delete().neq('id', 0);

        if (error) {
            console.error("Clear All Error:", error);
            addLog(`Error clearing records: ${error.message}`);
        } else {
            setQueue([]);
            addLog("SYSTEM: All patient records cleared.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-cyber-card p-6 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="text-cyber-primary" /> Patient Registry
                    </h2>
                    <p className="text-cyber-muted text-sm mt-1">Manage and track all active patient cases</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold">
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
                        <input className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-primary transition-all" placeholder="Search patients..." />
                    </div>
                    <SimulationButton setQueue={setQueue} addLog={addLog} />
                </div>
            </div>

            <div className="bg-cyber-card rounded-2xl p-6 border border-white/5 shadow-xl">
                <QueuePanel queue={queue} onDelete={handleDelete} />
            </div>
        </div>
    );
}
