/**
 * Age calculation utilities for baseball stat tracker
 */

import { Dayjs } from "dayjs";

/**
 * Convert Excel serial date to JavaScript Date
 * Excel incorrectly treats 1900 as a leap year, so we subtract 2 days
 * @param serial - Excel serial date number
 * @returns JavaScript Date object
 */
export const excelSerialToDate = (serial: number): Date => {
  const excelEpoch = new Date(1900, 0, 1);
  const days = serial - 2; // Excel leap year correction
  return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
};

/**
 * Calculate current age in years from date of birth
 * @param dob - Date of birth (Excel serial or Date object)
 * @returns Age in years
 */
export const calculateAge = (dob: Dayjs): number => {
  console.log(dob);
  const today = new Date();
  // Convert dayjs to js Date object
  const birthDate = new Date(String(dob).split("T")[0]);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Map age to appropriate goal range category
 * @param age - Age in years
 * @returns Age range category
 */
export const getAgeRange = (age: number): string => {
  if (age <= 12) return "12 or less";
  if (age >= 13 && age <= 14) return "13-14";
  if (age >= 15 && age <= 16) return "15-16";
  if (age >= 17 && age <= 18) return "17-18";
  return "18+";
};

/**
 * Format date of birth for display
 * @param dob - Date of birth
 * @returns Formatted date string
 */
export const formatDateOfBirth = (dob: number | Date): string => {
  const date = typeof dob === "number" ? excelSerialToDate(dob) : new Date(dob);
  return date.toLocaleDateString();
};
