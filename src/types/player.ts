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
