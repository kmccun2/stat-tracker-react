export interface Metric {
  id?: string;
  metric: string;
  description: string;
  category: string;
  categorySort: number;
  isActive: boolean;
}

export interface UpsertMetric {
  metric: string;
  description: string;
  categoryId: string;
  isActive: boolean;
}

export interface Category {
  category: string;
  categorySort: number;
}
