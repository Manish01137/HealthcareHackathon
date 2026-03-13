export function assessSeverity(patient) {
  const symptoms = (patient.symptoms || "").toLowerCase();
  let score = 0;
  const explanation = [];

  const age = parseInt(patient.age) || 0;
  if (age > 60) {
    score += 2;
    explanation.push("Patient age > 60 (+2)");
  }

  if (symptoms.includes("heart") || symptoms.includes("chest")) {
    score += 5;
    explanation.push("Heart-related symptoms (+5)");
  }

  if (symptoms.includes("breathing")) {
    score += 4;
    explanation.push("Breathing difficulty (+4)");
  }

  if (symptoms.includes("unconscious") || patient.consciousness === "unconscious") {
    score += 5;
    explanation.push("Unconsciousness (+5)");
  }

  if (symptoms.includes("bleeding")) {
    score += 4;
    explanation.push("Heavy bleeding (+4)");
  }

  let severity = "LOW";
  if (score >= 8) severity = "CRITICAL";
  else if (score >= 5) severity = "HIGH";
  else if (score >= 3) severity = "MEDIUM";

  return {
    severity,
    level: severity, // Keep level for backwards compatibility if needed
    score,
    explanation: explanation.length > 0 ? explanation.join(", ") : "Normal assessment, no critical factors found"
  };
}