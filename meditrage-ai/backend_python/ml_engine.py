import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import json
import re

class TriageModel:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.device = "cpu" # Force CPU as requested
        
    def train(self):
        print("Loading google/flan-t5-base model...")
        try:
            self.tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base")
            self.model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-base").to(self.device)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, data):
        if not self.model:
            return {"error": "Model not loaded"}

        # Construct Prompt
        prompt = f"""
        Act as an expert medical triage nurse. Analyze the following patient:
        Name: {data.get('name', 'Unknown')}
        Age: {data['age']}
        Height: {data.get('height', 'N/A')} cm
        Weight: {data.get('weight', 'N/A')} kg
        Heart Rate: {data['heartRate']}
        BP: {data['bp']}
        Temp: {data['temp']}F
        Symptoms: {data['symptoms']}

        Task:
        1. Determine Risk Level (Low, Medium, High).
        2. Assign Department (General, Cardiology, Trauma, Neurology, Orthopedics).
        3. Provide a brief medical CheckReasoning (max 15 words).

        Output Format:
        Risk: [Risk]
        Dept: [Department]
        Reason: [Reasoning]
        """

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_new_tokens=100)
        response_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Parse Output (Heuristic parsing)
        risk = "Low"
        if "High" in response_text: risk = "High"
        elif "Medium" in response_text: risk = "Medium"
        
        dept = "General"
        for d in ["Cardiology", "Trauma", "Neurology", "Orthopedics"]:
            if d in response_text:
                dept = d
                break
        
        # Extract Reason (Simple cleanup)
        reason = response_text.replace("Risk:", "").replace("Dept:", "").replace("Reason:", "").strip()
        # Clean up if it mashed them together, take last part usually reason
        if "High" in reason or "Medium" in reason: # Fallback if parsing failed
             reason = f"Automated analysis based on {data['symptoms']}"

        # Rule-based Overrides for Safety (Hybrid Approach)
        score = 0
        try:
            hr = int(data['heartRate'])
            bp_sys = int(str(data['bp']).split('/')[0])
            if hr > 110 or hr < 50: score += 25
            if bp_sys > 160 or bp_sys < 90: score += 25
            if "chest pain" in data['symptoms'].lower(): score += 20
            if "unconscious" in data['symptoms'].lower(): score += 30
            if float(data['temp']) > 103: score += 15
        except:
            score = 50 # Default

        # Ensure High Risk if score is critical
        if score > 70: risk = "High"

        return {
            "risk": risk,
            "score": min(score + 10, 99), # Bias slightly higher for safety
            "department": dept,
            "reason": reason,
            "deteriorationRisk": risk == "High" and score > 80
        }

ml_engine = TriageModel()
