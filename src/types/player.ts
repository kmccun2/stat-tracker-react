import { Dayjs } from "dayjs";

export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  dob: Dayjs;
  coachId: number;
  hittingScore?: number;
  throwingScore?: number;
  strengthScore?: number;
  speedScore?: number;
  powerScore?: number;
  mobilityScore?: number;
}

export interface PlayerProfile extends Player {
  hittingTrendingValue: number;
  throwingTrendingValue: number;
  strengthTrendingValue: number;
  speedTrendingValue: number;
  powerTrendingValue: number;
  mobilityTrendingValue: number;
  extededMetrics: {
    metricName: string;
    metricValue: number;
    metricDate: string;
  }[];
}
