export function triagePatient(data) {
  let score = 0;

  if (data.age > 60) score += 15;
  if (data.heartRate > 120) score += 25;
  if (data.bp < 90) score += 25;
  if (data.temp > 39) score += 15;

  if (data.symptoms.includes("chest pain")) score += 30;
  if (data.symptoms.includes("breathing")) score += 25;
  if (data.symptoms.includes("unconscious")) score += 40;

  let risk = "LOW";
  if (score > 70) risk = "HIGH";
  else if (score > 40) risk = "MEDIUM";

  return {
    score,
    risk,
    department: getDepartment(data.symptoms),
    explanation: generateExplanation(score, data)
  };
}

function getDepartment(symptoms){
  if(symptoms.includes("chest")) return "Cardiology";
  if(symptoms.includes("breathing")) return "Pulmonology";
  return "General Medicine";
}

function generateExplanation(score,data){
  return `Priority score ${score}. Based on age ${data.age}, symptoms ${data.symptoms}.`;
}
