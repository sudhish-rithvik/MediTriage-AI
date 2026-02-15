import { useState } from "react";
import axios from "axios";
import { Mic, Activity } from "lucide-react";

export default function PatientForm({ onResult }) {
    const [form, setForm] = useState({
        name: "",
        age: "",
        height: "",
        weight: "",
        heartRate: "",
        bp: "",
        temp: "",
        symptoms: ""
    });
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser. Please use Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setForm(prev => ({
                ...prev,
                symptoms: prev.symptoms ? `${prev.symptoms} ${transcript}` : transcript
            }));
        };

        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.age || !form.name) return alert("Name and Age required");

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/triage", form);
            // Inject name back into result for display if backend doesn't return it
            onResult({ ...res.data, name: form.name });
        } catch (err) {
            alert("Triage failed: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-cyber-card p-6 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
            {/* Decorative Gradient Blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyber-primary/20 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 relative z-10">
                <Activity className="text-cyber-accent w-5 h-5" /> Patient Intake
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <InputGroup label="Full Name" name="name" val={form.name} onChange={handleChange} ph="John Doe" />

                <div className="grid grid-cols-3 gap-3">
                    <InputGroup label="Age" name="age" val={form.age} onChange={handleChange} ph="45" />
                    <InputGroup label="Height (cm)" name="height" val={form.height} onChange={handleChange} ph="175" />
                    <InputGroup label="Weight (kg)" name="weight" val={form.weight} onChange={handleChange} ph="70" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <InputGroup label="Temp (°F)" name="temp" val={form.temp} onChange={handleChange} ph="98.6" />
                    <InputGroup label="HR (bpm)" name="heartRate" val={form.heartRate} onChange={handleChange} ph="80" />
                    <InputGroup label="BP" name="bp" val={form.bp} onChange={handleChange} ph="120/80" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-cyber-muted uppercase mb-2 flex justify-between">
                        Symptoms
                        {listening && <span className="text-cyber-accent animate-pulse">● Listening...</span>}
                    </label>
                    <div className="relative group">
                        <textarea name="symptoms" rows="3" value={form.symptoms} onChange={handleChange}
                            className="w-full bg-black/20 text-white rounded-xl border border-white/10 p-3 text-sm focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all resize-none"
                            placeholder="Describe complaints..."></textarea>
                        <button type="button" onClick={startListening}
                            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all ${listening ? 'bg-cyber-accent text-white' : 'text-cyber-muted hover:text-white hover:bg-white/10'}`}>
                            <Mic className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyber-primary to-cyber-accent hover:opacity-90 transition-all shadow-lg shadow-cyber-primary/25 disabled:opacity-50 cursor-pointer">
                    {loading ? "Analyzing Vitals..." : "Run AI Analysis"}
                </button>
            </form>
        </div>
    );
}

function InputGroup({ label, name, val, onChange, ph }) {
    return (
        <div>
            <label className="block text-xs font-bold text-cyber-muted uppercase mb-2">{label}</label>
            <input name={name} value={val} onChange={onChange}
                className="w-full bg-black/20 text-white rounded-xl border border-white/10 p-3 text-sm focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all placeholder-white/20"
                placeholder={ph} />
        </div>
    )
}
