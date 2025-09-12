/**
 * Goal resolution utilities for baseball stat tracker
 */

import type { Player, AssessmentType, Goal } from '../types';

/**
 * Goal information returned by findGoal
 */
export interface GoalInfo {
  goal?: number;
  minGoal?: number;
  maxGoal?: number;
  lowIsGood: boolean;
  unit?: string;
}

/**
 * Find the appropriate goal for a player and assessment type
 * @param player - Player object with gender and ageRange
 * @param assessmentType - Assessment type object
 * @param goals - Array of goal objects
 * @returns Goal information or null if not found
 */
export const findGoal = (player: Player, assessmentType: AssessmentType, goals: Goal[]): GoalInfo | null => {
  const goal = goals.find(g => 
    g.assessmentTypeId === assessmentType.id && 
    g.ageRange === player.ageRange
  );
  
  if (!goal) return null;
  
  // For now, using a simplified goal structure
  // This will need to be adjusted based on your actual goal data structure
  return {
    goal: goal.targetValue,
    lowIsGood: false, // This should come from the goal or assessment type
    unit: assessmentType.unit
  };
};

/**
 * Check if a player's result meets the goal criteria
 * @param player - Player object
 * @param assessmentType - Assessment type object
 * @param result - Assessment result value
 * @param goals - Array of goal objects
 * @returns True if goal met, false if not met, null if no goal or result
 */
export const isGoalMet = (player: Player, assessmentType: AssessmentType, result: string | number, goals: Goal[]): boolean | null => {
  if (!result || result === '') return null;
  
  const goalInfo = findGoal(player, assessmentType, goals);
  if (!goalInfo) return null;
  
  const numResult = parseFloat(result.toString());
  
  // If we have min and max goals, check if result is in range
  if (goalInfo.minGoal && goalInfo.maxGoal) {
    return numResult >= goalInfo.minGoal && numResult <= goalInfo.maxGoal;
  }
  
  // If we have a single goal, check based on lowIsGood
  if (goalInfo.goal) {
    if (goalInfo.lowIsGood) {
      return numResult <= goalInfo.goal;
    } else {
      return numResult >= goalInfo.goal;
    }
  }
  
  return null;
};

/**
 * Get goal status text for display
 * @param goalMet - Result from isGoalMet function
 * @returns Status text
 */
export const getGoalStatusText = (goalMet: boolean | null): string => {
  if (goalMet === null) return 'No Goal Set';
  return goalMet ? 'Goal Met' : 'Below Goal';
};

/**
 * Get goal status variant for Bootstrap styling
 * @param goalMet - Result from isGoalMet function
 * @returns Bootstrap variant name
 */
export const getGoalStatusVariant = (goalMet: boolean | null): string => {
  if (goalMet === null) return 'secondary';
  return goalMet ? 'success' : 'warning';
};
