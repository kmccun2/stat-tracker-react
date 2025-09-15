export interface Metric {
  id?: string;
  metric: string;
  category: string;
  metric_sort: number;
  category_sort: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricCategory {
  category: string;
  category_sort: number;
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
