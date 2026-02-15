import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/triage", async (req, res) => {
    const { age, heartRate, bp, temp, symptoms } = req.body;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: `You are an emergency room triage AI. Return only JSON (no markdown):
                        {
                            "risk": "High" | "Medium" | "Low",
                            "score": number (0-100),
                            "department": "Cardiology" | "General" | "Neurology" | "Trauma" | "Orthopedics",
                            "reason": "Short clinical explanation",
                            "deteriorationRisk": boolean
                        }`
                    },
                    {
                        role: "user",
                        content: JSON.stringify({ age, heartRate, bp, temp, symptoms })
                    }
                ],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let result = response.data.choices[0].message.content;
        // Ensure we send back an object, not a string
        try {
            if (typeof result === 'string') {
                result = JSON.parse(result);
            }
        } catch (e) {
            console.error("Failed to parse LLM response", e);
        }

        res.json(result);
    }
    catch (e) {
        console.error("Groq/Server Error:", e.response?.data || e.message);
        // Fallback Mock for Demo Robustness
        const mockResult = {
            risk: "High",
            score: 88,
            department: "Cardiology",
            reason: "FALLBACK: Symptoms indicate potential cardiac event. Immediate care required.",
            deteriorationRisk: true
        };
        res.json(mockResult);
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
