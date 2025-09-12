// Common types used throughout the application

export interface Player {
  id: string;
  name: string;
  email?: string;
  dateOfBirth: string;
  position?: string;
  team?: string;
  coach?: string;
  ageRange?: string;
  Gender?: 'Male' | 'Female';
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentType {
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
