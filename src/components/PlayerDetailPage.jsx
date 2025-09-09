import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb, Nav, Tab } from 'react-bootstrap';
import { FaArrowLeft, FaBaseballBall, FaTable, FaChartLine, FaBullseye, FaChartArea } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AssessmentTable from './AssessmentTable';
import ExportButton from './ExportButton';
import SampleDataButton from './SampleDataButton';
import PlayerProgressChart from './charts/PlayerProgressChart';
import GoalComparisonChart from './charts/GoalComparisonChart';
import CategoryRadarChart from './charts/CategoryRadarChart';

const PlayerDetailPage = () => {
  const { id } = useParams();
  const { players, assessmentTypes, goals, getAssessmentResult, findGoal, isGoalMet } = useData();
  const [activeTab, setActiveTab] = useState('assessments');
  
  const player = players.find(p => p.id === parseInt(id));
  
  if (!player) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Players
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Player Not Found</Breadcrumb.Item>
            </Breadcrumb>
            
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">Player Not Found</h4>
              <p>The player with ID {id} was not found.</p>
              <hr />
              <Button as={Link} to="/" variant="primary" className="d-flex align-items-center gap-2">
                <FaArrowLeft /> Back to Players
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Get all assessment results for this player
  const assessmentResults = {};
  assessmentTypes.forEach(assessment => {
    const result = getAssessmentResult(player.id, assessment.AssessmentType);
    if (result) {
      assessmentResults[`${player.id}-${assessment.AssessmentType}`] = result;
    }
  });

  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Players
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{player.Name}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="player-info-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h1 className="mb-3 text-primary d-flex align-items-center gap-2">
                    <FaBaseballBall /> {player.Name}
                  </h1>
                  <div className="d-flex gap-3 flex-wrap">
                    <div>
                      <strong>Age:</strong>
                      <Badge bg="info" className="ms-2">{player.age} years old</Badge>
                    </div>
                    <div>
                      <strong>Gender:</strong>
                      <Badge bg="secondary" className="ms-2">{player.Gender}</Badge>
                    </div>
                    <div>
                      <strong>Age Group:</strong>
                      <Badge bg="success" className="ms-2">{player.ageRange}</Badge>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="export-section">
                    <h6 className="text-muted mb-2">Export Options</h6>
                    <ExportButton player={player} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/" variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2">
            <FaArrowLeft /> Back to Players
          </Button>
        </Col>
      </Row>
      
      {/* Sample Data Button for Testing */}
      <SampleDataButton player={player} />
      
      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="assessments" className="d-flex align-items-center gap-2">
                <FaTable /> Assessment Data
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="progress" className="d-flex align-items-center gap-2">
                <FaChartLine /> Progress Chart
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="goals" className="d-flex align-items-center gap-2">
                <FaBullseye /> Goal Comparison
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="radar" className="d-flex align-items-center gap-2">
                <FaChartArea /> Category Overview
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Tab Content */}
      <Tab.Container activeKey={activeTab}>
        <Tab.Content>
          <Tab.Pane eventKey="assessments">
            <AssessmentTable player={player} />
          </Tab.Pane>
          
          <Tab.Pane eventKey="progress">
            <Row>
              <Col>
                <PlayerProgressChart 
                  player={player}
                  assessmentResults={assessmentResults}
                  assessmentTypes={assessmentTypes}
                  goals={goals}
                  type="line"
                />
              </Col>
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="goals">
            <Row>
              <Col>
                <GoalComparisonChart 
                  player={player}
                  assessmentResults={assessmentResults}
                  assessmentTypes={assessmentTypes}
                  findGoal={findGoal}
                />
              </Col>
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="radar">
            <Row>
              <Col>
                <CategoryRadarChart 
                  player={player}
                  assessmentResults={assessmentResults}
                  assessmentTypes={assessmentTypes}
                  findGoal={findGoal}
                  isGoalMet={isGoalMet}
                />
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default PlayerDetailPage;
