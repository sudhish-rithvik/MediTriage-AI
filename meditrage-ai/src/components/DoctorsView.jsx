import { useState, useEffect } from "react";
import { Stethoscope, Award, Star } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function DoctorsView() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const { data, error } = await supabase.from('doctors').select('*').order('name');
            if (data) setDoctors(data);
        };
        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-cyber-card p-6 rounded-2xl border border-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Stethoscope className="text-cyber-accent" /> Medical Staff
                </h2>
                <p className="text-cyber-muted text-sm mt-1">Active doctors on duty</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(doc => (
                    <div key={doc.id} className="bg-cyber-card p-6 rounded-2xl border border-white/5 hover:border-cyber-primary/50 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-accent flex items-center justify-center text-white font-bold text-xl">
                                {doc.name[4]}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{doc.name}</h3>
                                <span className="text-xs text-cyber-muted uppercase tracking-wider">{doc.specialty}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className={`px-2 py-1 rounded-md bg-white/5 ${doc.status === 'Available' ? 'text-green-400' : 'text-amber-400'}`}>
                                {doc.status}
                            </span>
                            <span className="flex items-center gap-1 text-cyber-primary">
                                <Star className="w-3 h-3 fill-current" /> {doc.rating}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
