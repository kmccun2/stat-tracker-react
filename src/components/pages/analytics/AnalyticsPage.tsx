// React library for component creation
import React from 'react';

// React Bootstrap UI components for layout and feedback
import { Alert, Card, Badge } from 'react-bootstrap';

// Font Awesome React icons for visual indicators
import { FaChartLine, FaBullseye, FaTrophy, FaUsers, FaClipboardList } from 'react-icons/fa';

// Data context hook for accessing application state
import { useData } from '../../../context/DataContext';

// Chart components for data visualization
import TeamOverviewChart from '../../charts/TeamOverviewChart';

// Shared UI components
import PageHeader from '../../common/PageHeader';

/**
 * Player interface for type safety in analytics calculations
 * Note: This should ideally be imported from a shared types file
 */
interface Player {
  id: number;
  Name: string;
  age: number;
  Gender: 'M' | 'F';
}

/**
 * Assessment type interface for categorizing assessments
 * Note: This should ideally be imported from a shared types file
 */
interface AssessmentType {
  AssessmentType: string;
  Category?: string;
}

/**
 * Assessment results mapping interface
 * Maps player-assessment combinations to their numeric results
 */
interface AssessmentResults {
  [key: string]: number;
}

/**
 * AnalyticsPage (ReportsPage) Component
 *
 * Provides comprehensive team analytics and reporting dashboard including:
 * - Team summary statistics (players, assessments, goals)
 * - Assessment completion rates
 * - Goal achievement tracking
 * - Interactive charts and visualizations
 *
 * This page aggregates data from all players and assessments to provide
 * coaches with insights into team performance and progress.
 */
const ReportsPage: React.FC = () => {
  const { players, assessmentTypes, goals, getAssessmentResult, findGoal, isGoalMet } = useData();

  // Calculate summary statistics
  const totalPlayers: number = players.length;
  const totalAssessments: number = players.length * assessmentTypes.length;

  // Get all assessment results
  const assessmentResults: AssessmentResults = {};
  players.forEach((player: Player) => {
    assessmentTypes.forEach((assessment: AssessmentType) => {
      const result = getAssessmentResult(player.id, assessment.AssessmentType);
      if (result) {
        assessmentResults[`${player.id}-${assessment.AssessmentType}`] = result;
      }
    });
  });

  const totalEntered: number = Object.keys(assessmentResults).length;
  const completionRate: string =
    totalAssessments > 0 ? ((totalEntered / totalAssessments) * 100).toFixed(1) : '0';

  // Calculate goals met
  const totalGoalsMet: number = players.reduce((total: number, player: Player) => {
    return (
      total +
      assessmentTypes.reduce((playerTotal: number, assessment: AssessmentType) => {
        const result = getAssessmentResult(player.id, assessment.AssessmentType);
        if (result && result !== '') {
          const goalMet = isGoalMet(player, assessment.AssessmentType, result);
          return playerTotal + (goalMet ? 1 : 0);
        }
        return playerTotal;
      }, 0)
    );
  }, 0);

  const achievementRate: string =
    totalEntered > 0 ? ((totalGoalsMet / totalEntered) * 100).toFixed(1) : '0';

  return (
    <>
      <PageHeader
        title="Team Reports & Analytics"
        subtitle="Comprehensive overview of team performance and progress"
        icon={<FaChartLine />}
      />

      {/* Main Content */}
      <div className="page-main-content">
        {/* Summary Statistics */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="flex-fill" style={{ minWidth: '250px' }}>
            <Card className="border-0 h-100">
              <Card.Body className="text-center">
                <FaUsers className="text-primary mb-2" size={32} />
                <h3 className="mb-1">{totalPlayers}</h3>
                <p className="text-muted mb-0">Active Players</p>
              </Card.Body>
            </Card>
          </div>
          <div className="flex-fill" style={{ minWidth: '250px' }}>
            <Card className="border-0 h-100">
              <Card.Body className="text-center">
                <FaClipboardList className="text-info mb-2" size={32} />
                <h3 className="mb-1">{totalEntered}</h3>
                <p className="text-muted mb-0">Assessments Completed</p>
                <Badge bg="secondary">{completionRate}% Complete</Badge>
              </Card.Body>
            </Card>
          </div>
          <div className="flex-fill" style={{ minWidth: '250px' }}>
            <Card className="border-0 h-100">
              <Card.Body className="text-center">
                <FaTrophy className="text-success mb-2" size={32} />
                <h3 className="mb-1">{totalGoalsMet}</h3>
                <p className="text-muted mb-0">Goals Achieved</p>
                <Badge bg="success">{achievementRate}% Success Rate</Badge>
              </Card.Body>
            </Card>
          </div>
          <div className="flex-fill" style={{ minWidth: '250px' }}>
            <Card className="border-0 h-100">
              <Card.Body className="text-center">
                <FaBullseye className="text-warning mb-2" size={32} />
                <h3 className="mb-1">{assessmentTypes.length}</h3>
                <p className="text-muted mb-0">Assessment Types</p>
                <Badge bg="warning">
                  {[...new Set(assessmentTypes.map((a: AssessmentType) => a.Category))].length}{' '}
                  Categories
                </Badge>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Charts */}
        {totalEntered > 0 ? (
          <TeamOverviewChart
            players={players}
            assessmentResults={assessmentResults}
            assessmentTypes={assessmentTypes}
            goals={goals}
            findGoal={findGoal}
            isGoalMet={isGoalMet}
          />
        ) : (
          <div>
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Data Available</Alert.Heading>
              <p>
                Start entering assessment results for your players to see detailed analytics and
                charts.
              </p>
              <hr />
              <p className="mb-0">
                Visit individual player pages to input assessment data, then return here to view
                comprehensive reports.
              </p>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
