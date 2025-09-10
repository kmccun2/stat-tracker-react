/**
 * Goal resolution utilities for baseball stat tracker
 */

/**
 * Find the appropriate goal for a player and assessment type
 * @param {Object} player - Player object with gender and ageRange
 * @param {string} assessmentType - Assessment type name
 * @param {Array} goals - Array of goal objects
 * @returns {Object|null} Goal information or null if not found
 */
export const findGoal = (player, assessmentType, goals) => {
  const goal = goals.find(g => 
    g.AssessmentType === assessmentType && 
    g.AgeRange === player.ageRange
  );
  
  if (!goal) return null;
  
  const genderGoal = player.Gender === 'Male' ? goal.MaleGoal : goal.FemaleGoal;
  const genderMinGoal = player.Gender === 'Male' ? goal.MaleMinGoal : goal.FemaleMinGoal;
  const genderMaxGoal = player.Gender === 'Male' ? goal.MaleMaxGoal : goal.FemaleMaxGoal;
  
  return {
    goal: genderGoal,
    minGoal: genderMinGoal,
    maxGoal: genderMaxGoal,
    lowIsGood: goal.LowIsGood === '1',
    unit: goal.Unit
  };
};

/**
 * Check if a player's result meets the goal criteria
 * @param {Object} player - Player object
 * @param {string} assessmentType - Assessment type name
 * @param {string|number} result - Assessment result value
 * @param {Array} goals - Array of goal objects
 * @returns {boolean|null} True if goal met, false if not met, null if no goal or result
 */
export const isGoalMet = (player, assessmentType, result, goals) => {
  if (!result || result === '') return null;
  
  const goalInfo = findGoal(player, assessmentType, goals);
  if (!goalInfo) return null;
  
  const numResult = parseFloat(result);
  
  // If we have min and max goals, check if result is in range
  if (goalInfo.minGoal && goalInfo.maxGoal) {
    const minGoal = parseFloat(goalInfo.minGoal);
    const maxGoal = parseFloat(goalInfo.maxGoal);
    return numResult >= minGoal && numResult <= maxGoal;
  }
  
  // If we have a single goal, check based on lowIsGood
  if (goalInfo.goal) {
    const goal = parseFloat(goalInfo.goal);
    if (goalInfo.lowIsGood) {
      return numResult <= goal;
    } else {
      return numResult >= goal;
    }
  }
  
  return null;
};

/**
 * Get goal status text for display
 * @param {boolean|null} goalMet - Result from isGoalMet function
 * @returns {string} Status text
 */
export const getGoalStatusText = (goalMet) => {
  if (goalMet === null) return 'No Goal Set';
  return goalMet ? 'Goal Met' : 'Below Goal';
};

/**
 * Get goal status variant for Bootstrap styling
 * @param {boolean|null} goalMet - Result from isGoalMet function
 * @returns {string} Bootstrap variant name
 */
export const getGoalStatusVariant = (goalMet) => {
  if (goalMet === null) return 'secondary';
  return goalMet ? 'success' : 'warning';
};
