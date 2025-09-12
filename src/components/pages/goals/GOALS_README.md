# Goals Page - Metric Scoring System

## Overview

The Goals Page allows administrators to configure scoring parameters for each metric based on gender and age ranges. This system provides a standardized way to evaluate player performance across different assessment types.

## Scoring System Logic

### Score Calculation Parameters

For each metric/gender/age range combination, the following parameters are configured:

1. **Direction Preference (`low_is_good`)**

   - `true`: Lower values are better (e.g., sprint times, where faster = better)
   - `false`: Higher values are better (e.g., vertical jump, where higher = better)

2. **Goal Type (`is_range_goal`)**

   - `true`: Range goal - there's an optimal range, neither too high nor too low is good (e.g., attack angle for hitting)
   - `false`: Single direction goal - either higher or lower is always better

3. **Scoring Boundaries**
   - **Low End (`score_low_end`)**: Value that equates to a score of 0
     - Any value lower than this will also score 0
   - **High End (`score_high_end`)**: Value that equates to a score of 100
     - Any value higher than this will also score 100
   - **Average Value (`score_average`)**: Value that equates to a score of 75
     - This represents a "good" performance level

### Score Calculation Logic (Future Implementation)

#### For Non-Range Goals (`is_range_goal = false`):

- **If `low_is_good = true`** (lower is better):

  - Score 0: `score_low_end` (worst performance)
  - Score 75: `score_average` (good performance)
  - Score 100: `score_high_end` (best performance)
  - Linear interpolation between these points

- **If `low_is_good = false`** (higher is better):
  - Score 0: `score_low_end` (worst performance)
  - Score 75: `score_average` (good performance)
  - Score 100: `score_high_end` (best performance)
  - Linear interpolation between these points

#### For Range Goals (`is_range_goal = true`):

- Optimal range is between `score_average - tolerance` and `score_average + tolerance`
- Score 100: Values within the optimal range
- Score 75: Values at `score_average`
- Score 0: Values at or beyond `score_low_end` or `score_high_end`
- Scores decrease as values move away from the optimal range

## Data Structure

### Database Schema

```sql
CREATE TABLE goals (
    id INTEGER PRIMARY KEY,
    assessment_type TEXT NOT NULL,
    unit TEXT NOT NULL,
    age_range TEXT NOT NULL,
    gender TEXT NOT NULL,
    low_is_good INTEGER NOT NULL DEFAULT 0,
    is_range_goal INTEGER NOT NULL DEFAULT 0,
    score_low_end REAL,
    score_high_end REAL,
    score_average REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Age Ranges

- "12 or less"
- "13-14"
- "15-16"
- "17-18"
- "18+"

### Gender Options

- "M" (Male)
- "F" (Female)

## User Interface Features

### Goals Management Table

- Display all metrics with their current goal configurations
- Filter by assessment type, age range, and gender
- Inline editing capabilities for quick updates
- Bulk operations for setting goals across multiple age ranges/genders

### Goal Configuration Form

- Dropdown selectors for assessment type, age range, and gender
- Toggle switches for `low_is_good` and `is_range_goal`
- Number inputs for scoring boundaries
- Real-time validation to ensure logical consistency
- Preview of how scores would be calculated

### Validation Rules

- `score_low_end` must be different from `score_high_end`
- `score_average` should be between `score_low_end` and `score_high_end`
- For range goals, additional validation may be needed
- Cannot have duplicate entries for the same metric/gender/age combination

## Future Enhancements

### Phase 2 Features

- **Score Calculation Implementation**: Actual scoring logic based on the configured parameters
- **Score Visualization**: Charts showing score distribution for teams/players
- **Goal Templates**: Predefined goal sets for different sports or skill levels
- **Historical Tracking**: Track changes to goals over time
- **Import/Export**: Bulk import of goal configurations from spreadsheets

### Phase 3 Features

- **Advanced Range Goals**: More sophisticated range goal calculations
- **Conditional Goals**: Goals that change based on other metrics
- **Team-Specific Goals**: Override default goals for specific teams
- **Seasonal Adjustments**: Goals that automatically adjust based on season

## Technical Notes

### API Endpoints

- `GET /api/goals` - Retrieve all goals
- `GET /api/goals/metric/:assessmentType` - Get goals for specific metric
- `POST /api/goals` - Create new goal configuration
- `PUT /api/goals/:id` - Update existing goal
- `DELETE /api/goals/:id` - Delete goal configuration

### Performance Considerations

- Goals table should be indexed on `assessment_type`, `age_range`, and `gender`
- Consider caching frequently accessed goal configurations
- Batch operations for bulk updates to improve performance

## Migration Notes

The current goals table structure needs to be updated to support the new scoring system. This will require:

1. Adding new columns for the scoring parameters
2. Splitting gender-specific goals into separate records
3. Data migration for existing goal configurations
4. Updating API endpoints to handle the new structure
