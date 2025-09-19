export interface Assessment {
  id: number;
  playerId: string;
  playerName: string;
  date: string;
  [key: string]: any; // Dynamic keys for metrics (e.g., metricId: value)
}

export interface PlayerAssessmentScore {
  playerId: number;
  metricId: string;
  score: number | string;
  notes?: string;
}

export interface AssessmentSubmission {
  assessmentType: string;
  assessmentDate: string;
  scores: PlayerAssessmentScore[];
  notes?: string;
}

export interface AssessmentFormState {
  selectedPlayers: number[];
  selectedMetrics: string[];
  playerScores: { [key: string]: number | string }; // key format: "playerId-metricId"
  assessmentDate: string;
  notes: string;
}
