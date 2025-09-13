// Common types used throughout the application

import { AssessmentType } from "./assessment";
import { Goal } from "./metric";
import { Player } from "./player";

export interface AssessmentResult {
  id: string;
  playerId: string;
  assessmentTypeId: string;
  value: number;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Auth0Config {
  domain: string;
  clientId: string;
  redirectUri: string;
  audience: string;
  scope: string;
  useRefreshTokens: boolean;
  cacheLocation: 'localstorage' | 'memory';
}

export interface DataContextType {
  players: Player[];
  assessmentTypes: AssessmentType[];
  goals: Goal[];
  loading: boolean;
  useBackend: boolean;
  apiService: any;
  updateAssessmentResult: (playerId: string, assessmentTypeId: string, result: string | number, date?: string, notes?: string) => Promise<void>;
  getAssessmentResult: (playerId: string, assessmentTypeId: string) => string | number;
  findGoal: (player: Player, assessmentType: AssessmentType) => any;
  isGoalMet: (player: Player, assessmentType: AssessmentType, result: number) => boolean | null;
  addPlayer: (player: any) => void;
  updatePlayer: (player: any) => void;
  deletePlayer: (playerId: any) => void;
  addAssessmentType: (assessmentType: any) => void;
  updateAssessmentType: (assessmentType: any) => void;
  deleteAssessmentType: (typeId: any) => void;
}
