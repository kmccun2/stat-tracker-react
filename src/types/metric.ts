export interface Metric {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  playerId?: string;
  assessmentTypeId: string;
  targetValue: number;
  targetDate?: string;
  ageRange?: string;
  position?: string;
  team?: string;
  coach?: string;
  createdAt?: string;
  updatedAt?: string;
}
