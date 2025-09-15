import { Dayjs } from "dayjs";

export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  dob: Dayjs;
  coachId: number;
}
