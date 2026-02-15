import { supabase } from "../supabaseClient";

export default function SimulationButton({ setQueue, addLog }) {

    // Simple Beep function using Web Audio API
    const playAlert = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop pitch

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    const handleSimulate = () => {
        addLog("INITIATING SIMULATION SEQUENCE...");
        addLog("CONNECTING TO TRIAGE NETWORK...");

        const realNames = [
            "James Oliver", "Maria Garcia", "Robert Chen", "Sarah Miller", "David Kim",
            "Emma Wilson", "Michael Brown", "Jennifer Lee", "William Taylor", "Lisa Anderson",
            "Thomas Martin", "Jessica White", "Daniel Thompson", "Ashley Martinez", "Brian Robinson"
        ];

        const fakePatients = Array.from({ length: 5 }).map((_, i) => {
            const randomName = realNames[Math.floor(Math.random() * realNames.length)];
            return {
                id: Date.now() + i,
                name: randomName,
                risk: i % 3 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",
                score: Math.floor(Math.random() * 60) + 30 + (i % 3 === 0 ? 30 : 0),
                department: ["General", "Cardiology", "Trauma", "Neurology", "Orthopedics"][Math.floor(Math.random() * 5)],
                symptoms: "Simulated clinical data stream...",
                reason: "AI Automated Triage Assessment",
                deteriorationRisk: i % 3 === 0 && Math.random() > 0.5
            };
        });

        // Critical Event Patient
        const criticalPatient = {
            id: Date.now() + 999,
            risk: "High",
            score: 99,
            department: "TRAUMA (CRITICAL)",
            symptoms: "MASSIVE HEMORRHAGE, UNCONSCIOUS",
            reason: "CRITICAL: IMMEDIATE INTERVENTION REQ",
            deteriorationRisk: true
        };

        // Dispatch regular patients
        fakePatients.forEach((p, i) => {
            setTimeout(async () => {
                addLog(`RECEIVING VITALS: ID #${p.id.toString().slice(-4)}`);
                setTimeout(async () => {
                    // Update Database instead of local state
                    // The subscription in App.jsx will update the UI
                    const { error } = await supabase.from('patients').insert([{
                        name: p.name,
                        age: "30-50",
                        risk: p.risk,
                        score: p.score,
                        department: p.department,
                        symptoms: p.symptoms,
                        status: "Waiting",
                        reason: p.reason,
                        deterioration_risk: p.deteriorationRisk
                    }]);

                    if (error) console.error("Sim Insert Error:", error);

                    addLog(`ANALYSIS COMPLETE: ${p.risk} RISK (Score: ${p.score})`);
                    if (p.risk === "High") playAlert();
                }, 200);
            }, i * 800);
        });

        // Dispatch CRITICAL EVENT after 5 seconds roughly (after 6th patient)
        setTimeout(async () => {
            playAlert();
            playAlert();
            playAlert();
            addLog("!!! CRITICAL ALERT: INCOMING TRAUMA !!!");
            addLog("!!! HIGH PRIORITY OVERRIDE !!!");

            await supabase.from('patients').insert([{
                name: "UNKNOWN TRAUMA",
                age: "Unknown",
                risk: criticalPatient.risk,
                score: criticalPatient.score,
                department: criticalPatient.department,
                symptoms: criticalPatient.symptoms,
                status: "CRITICAL",
                reason: criticalPatient.reason,
                deterioration_risk: criticalPatient.deteriorationRisk
            }]);

        }, 5000);
    };

    return (
        <button onClick={handleSimulate}
            className="bg-gradient-to-r from-cyber-primary to-cyber-accent text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyber-primary/25 transition-all active:scale-95 flex items-center gap-2 hover:opacity-90">
            <span>🚀</span> Run Simulation
        </button>
    );
}
