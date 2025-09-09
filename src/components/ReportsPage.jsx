import React from 'react';
import { Container, Row, Col, Alert, Card, Badge } from 'react-bootstrap';
import { FaChartLine, FaChartBar, FaBullseye, FaTrophy, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import TeamOverviewChart from './charts/TeamOverviewChart';

const ReportsPage = () => {
  const { players, assessmentTypes, goals, getAssessmentResult, findGoal, isGoalMet } = useData();

  // Calculate summary statistics
  const totalPlayers = players.length;
  const totalAssessments = players.length * assessmentTypes.length;
  
  // Get all assessment results
  const assessmentResults = {};
  players.forEach(player => {
    assessmentTypes.forEach(assessment => {
      const result = getAssessmentResult(player.id, assessment.AssessmentType);
      if (result) {
        assessmentResults[`${player.id}-${assessment.AssessmentType}`] = result;
      }
    });
  });

  const totalEntered = Object.keys(assessmentResults).length;
  const completionRate = totalAssessments > 0 ? ((totalEntered / totalAssessments) * 100).toFixed(1) : 0;

  // Calculate goals met
  const totalGoalsMet = players.reduce((total, player) => {
    return total + assessmentTypes.reduce((playerTotal, assessment) => {
      const result = getAssessmentResult(player.id, assessment.AssessmentType);
      if (result && result !== '') {
        const goalMet = isGoalMet(player, assessment.AssessmentType, result);
        return playerTotal + (goalMet ? 1 : 0);
      }
      return playerTotal;
    }, 0);
  }, 0);

  const achievementRate = totalEntered > 0 ? ((totalGoalsMet / totalEntered) * 100).toFixed(1) : 0;

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaChartLine /> Team Reports & Analytics
              </h2>
              <p className="text-muted mb-0">Comprehensive overview of team performance and progress</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Summary Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-primary mb-2" size={32} />
              <h3 className="mb-1">{totalPlayers}</h3>
              <p className="text-muted mb-0">Active Players</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <FaClipboardList className="text-info mb-2" size={32} />
              <h3 className="mb-1">{totalEntered}</h3>
              <p className="text-muted mb-0">Assessments Completed</p>
              <Badge bg="secondary">{completionRate}% Complete</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <FaTrophy className="text-success mb-2" size={32} />
              <h3 className="mb-1">{totalGoalsMet}</h3>
              <p className="text-muted mb-0">Goals Achieved</p>
              <Badge bg="success">{achievementRate}% Success Rate</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <FaBullseye className="text-warning mb-2" size={32} />
              <h3 className="mb-1">{assessmentTypes.length}</h3>
              <p className="text-muted mb-0">Assessment Types</p>
              <Badge bg="warning">{[...new Set(assessmentTypes.map(a => a.Category))].length} Categories</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Data Available</Alert.Heading>
              <p>
                Start entering assessment results for your players to see detailed analytics and charts.
              </p>
              <hr />
              <p className="mb-0">
                Visit individual player pages to input assessment data, then return here to view comprehensive reports.
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ReportsPage;
