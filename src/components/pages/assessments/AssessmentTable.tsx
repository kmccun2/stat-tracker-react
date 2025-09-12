import React from 'react';
import { Table, Form, Badge } from 'react-bootstrap';
import {
  FaBaseballBall,
  FaTachometerAlt,
  FaDumbbell,
  FaRunning,
  FaBolt,
  FaChartBar,
} from 'react-icons/fa';
import { useData } from '../../../context/DataContext';

// Type definitions
interface Player {
  id: number;
  Name: string;
  age: number;
  Gender: 'M' | 'F';
}

interface AssessmentType {
  AssessmentType: string;
  Category?: string;
  'Category Sort'?: number;
  AssessmentTypeSort?: number;
}

interface GoalInfo {
  minGoal?: number;
  maxGoal?: number;
  goal?: number;
  lowIsGood?: boolean;
  unit?: string;
}

interface AssessmentsByCategory {
  [category: string]: AssessmentType[];
}

interface AssessmentTableProps {
  player: Player;
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ player }) => {
  const { assessmentTypes, updateAssessmentResult, getAssessmentResult, findGoal, isGoalMet } =
    useData();

  // Function to get category icon
  const getCategoryIcon = (category: string): JSX.Element => {
    switch (category) {
      case 'General':
        return <FaChartBar />;
      case 'Hitting':
        return <FaBaseballBall />;
      case 'Throwing':
        return <FaTachometerAlt />;
      case 'Strength':
        return <FaDumbbell />;
      case 'Speed':
        return <FaRunning />;
      case 'Power':
        return <FaBolt />;
      default:
        return <FaChartBar />;
    }
  };

  // Group assessments by category
  const assessmentsByCategory: AssessmentsByCategory = assessmentTypes.reduce(
    (acc: AssessmentsByCategory, assessment: AssessmentType) => {
      const category = assessment.Category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(assessment);
      return acc;
    },
    {}
  );

  // Sort categories by CategorySort
  const sortedCategories: string[] = Object.keys(assessmentsByCategory).sort((a, b) => {
    const aSort = assessmentsByCategory[a][0]?.['Category Sort'] || 999;
    const bSort = assessmentsByCategory[b][0]?.['Category Sort'] || 999;
    return parseInt(aSort.toString()) - parseInt(bSort.toString());
  });

  const handleResultChange = (assessmentType: string, value: string): void => {
    updateAssessmentResult(player.id, assessmentType, value);
  };

  const formatGoal = (goalInfo: GoalInfo | null): string => {
    if (!goalInfo) return 'N/A';

    if (goalInfo.minGoal && goalInfo.maxGoal) {
      return `${goalInfo.minGoal}-${goalInfo.maxGoal} ${goalInfo.unit || ''}`;
    }

    if (goalInfo.goal) {
      const operator = goalInfo.lowIsGood ? '≤' : '≥';
      return `${operator} ${goalInfo.goal} ${goalInfo.unit || ''}`;
    }

    return 'N/A';
  };

  const getGoalStatus = (assessmentType: string, result: string | number): JSX.Element => {
    const goalMet = isGoalMet(player, assessmentType, result);

    if (goalMet === null || result === '') {
      return (
        <Badge bg="light" text="dark">
          Not Entered
        </Badge>
      );
    }

    return goalMet ? (
      <Badge bg="success">✓ Goal Met</Badge>
    ) : (
      <Badge bg="danger">✗ Below Goal</Badge>
    );
  };

  return (
    <div>
      {sortedCategories.map(category => {
        const categoryAssessments = assessmentsByCategory[category];
        // Sort assessments within category by AssessmentTypeSort
        const sortedAssessments = categoryAssessments.sort((a, b) => {
          const aSort = parseInt(a.AssessmentTypeSort?.toString() || '999');
          const bSort = parseInt(b.AssessmentTypeSort?.toString() || '999');
          return aSort - bSort;
        });

        return (
          <div key={category} className="mb-4">
            <h3 className="category-header d-flex align-items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </h3>

            <div className="assessment-table-container">
              <Table responsive striped hover className="mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Assessment</th>
                    <th>Goal</th>
                    <th>Your Result</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAssessments.map((assessment: AssessmentType) => {
                    const goalInfo = findGoal(player, assessment.AssessmentType) as GoalInfo | null;
                    const currentResult = getAssessmentResult(player.id, assessment.AssessmentType);

                    return (
                      <tr key={assessment.AssessmentType} className="assessment-row">
                        <td>
                          <div>
                            <strong>{assessment.AssessmentType}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg="outline-secondary" className="font-monospace">
                            {formatGoal(goalInfo)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Control
                              type="number"
                              step="0.01"
                              className="result-input"
                              value={currentResult}
                              onChange={e =>
                                handleResultChange(assessment.AssessmentType, e.target.value)
                              }
                              placeholder="Enter result"
                              size="sm"
                            />
                            {goalInfo?.unit && (
                              <small className="text-muted">{goalInfo.unit}</small>
                            )}
                          </div>
                        </td>
                        <td>{getGoalStatus(assessment.AssessmentType, currentResult)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssessmentTable;
