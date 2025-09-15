export interface Metric {
  id?: string;
  metric: string;
  description: string;
  category: string;
  metricSort: number;
  categorySort: number;
  isActive: boolean;
}

export interface MetricCategory {
  category: string;
  categorySort: number;
}
