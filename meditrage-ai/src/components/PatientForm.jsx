import { useState } from "react";
import axios from "axios";

export default function PatientForm({ onResult }) {
    const [form, setForm] = useState({
        age: "",
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
        if (!form.age || !form.symptoms) return alert("Age and Symptoms are required");

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/triage", form);
            onResult(res.data);
        } catch (err) {
            alert("Triage failed: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <span>🏥</span> Patient Intake
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                        <input name="age" type="number" value={form.age} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 45" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Temp (°F)</label>
                        <input name="temp" type="number" value={form.temp} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 98.6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Heart Rate (bpm)</label>
                        <input name="heartRate" type="number" value={form.heartRate} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 80" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">BP (mmHg)</label>
                        <input name="bp" type="text" value={form.bp} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 120/80" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1 flex justify-between">
                        Symptoms
                        {listening && <span className="text-red-500 animate-pulse text-xs font-bold">● Listening...</span>}
                    </label>
                    <div className="relative">
                        <textarea name="symptoms" rows="3" value={form.symptoms} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none pr-10" placeholder="Describe main complaints..."></textarea>
                        <button type="button" onClick={startListening} title="Voice Input"
                            className={`absolute right-2 bottom-2 p-2 rounded-full transition-all shadow-sm ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'}`}>
                            🎤
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}>
                    {loading ? "Analyzing..." : "Run AI Triage"}
                </button>
            </form>
        </div>
    );
}
