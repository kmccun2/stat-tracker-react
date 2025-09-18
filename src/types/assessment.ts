export interface Assessment {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  createdAt?: string;
  updatedAt?: string;
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
