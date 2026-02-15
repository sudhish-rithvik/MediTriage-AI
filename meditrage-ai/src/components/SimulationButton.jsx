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

        const fakePatients = Array.from({ length: 15 }).map((_, i) => ({
            id: Date.now() + i,
            risk: i % 5 === 0 ? "High" : i % 3 === 0 ? "Medium" : "Low",
            score: Math.floor(Math.random() * 60) + 30 + (i % 5 === 0 ? 30 : 0),
            department: ["General", "Cardiology", "Trauma", "Neurology", "Orthopedics"][Math.floor(Math.random() * 5)],
            symptoms: "Simulated clinical data stream...",
            reason: "AI Automated Triage Assessment",
            deteriorationRisk: i % 5 === 0 && Math.random() > 0.5
        }));

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
            setTimeout(() => {
                addLog(`RECEIVING VITALS: ID #${p.id.toString().slice(-4)}`);
                setTimeout(() => {
                    setQueue(prev => {
                        const updated = [...prev, p];
                        return updated.sort((a, b) => b.score - a.score);
                    });
                    addLog(`ANALYSIS COMPLETE: ${p.risk} RISK (Score: ${p.score})`);
                    if (p.risk === "High") playAlert();
                }, 200); // Slight processing delay
            }, i * 800); // Stagger arrival
        });

        // Dispatch CRITICAL EVENT after 5 seconds roughly (after 6th patient)
        setTimeout(() => {
            playAlert();
            playAlert();
            playAlert();
            addLog("!!! CRITICAL ALERT: INCOMING TRAUMA !!!");
            addLog("!!! HIGH PRIORITY OVERRIDE !!!");
            setQueue(prev => {
                const updated = [...prev, criticalPatient];
                return updated.sort((a, b) => b.score - a.score);
            });
        }, 5000);
    };

    return (
        <button onClick={handleSimulate}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 border border-teal-600">
            <span>🚀</span> Demo Simulation
        </button>
    );
}
