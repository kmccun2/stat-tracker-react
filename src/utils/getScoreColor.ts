export const getScoreColor = (score?: number) => {
  if (score === undefined || score === null) return "neutral";
  if (score >= 80) return "great";
  if (score >= 50) return "good";
  if (score >= 0) return "poor";
  return "neutral";
};
