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