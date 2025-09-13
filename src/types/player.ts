export interface Player {
  id: number;
  name: string;
  gender: 'M' | 'F';
  dob: number; // Excel serial date number
  age: number; // Calculated age
  dobFormatted: string; // Formatted date string
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  email?: string;
  dateOfBirth?: string;
  position?: string;
  team?: string;
  coach?: string;
  ageRange?: string;
  Gender?: 'Male' | 'Female';
  createdAt?: string;
  updatedAt?: string;
}
