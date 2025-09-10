import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb, Nav, Tab, Dropdown, Modal, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaBaseballBall, FaTable, FaChartLine, FaBullseye, FaChartArea } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AssessmentTable from './AssessmentTable';
import ExportButton from './ExportButton';
import SampleDataButton from './SampleDataButton';
import PlayerProgressChart from './charts/PlayerProgressChart';
import GoalComparisonChart from './charts/GoalComparisonChart';
import CategoryRadarChart from './charts/CategoryRadarChart';
import EditPlayerModal from './EditPlayerModal';

const PlayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const { players, assessmentTypes, goals, getAssessmentResult, findGoal, isGoalMet, updatePlayer, deletePlayer, apiService } = useData();
  const [activeTab, setActiveTab] = useState('assessments');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const player = players.find(p => p.id === parseInt(id));

  const handlePlayerUpdated = (updatedPlayer) => {
    updatePlayer(updatedPlayer);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      if (apiService) {
        const response = await apiService.deletePlayer(player.id);
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete player');
        }
      }
      deletePlayer(player.id);
      // Navigate back to players list after deletion
      navigate('/');
    } catch (error) {
      console.error('Error deleting player:', error);
      setDeleteError(error.message || 'Failed to delete player. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPlayer = () => {
    setShowEditModal(true);
  };
  
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
                <Col md={8}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="mb-0 text-primary d-flex align-items-center gap-2">
                      <FaBaseballBall /> {player.Name}
                    </h1>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        className="d-flex align-items-center gap-2"
                      >
                        ⚙️ Settings
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={handleEditPlayer} className="d-flex align-items-center gap-2">
                          <span>✏️</span>
                          Edit Player
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={handleDeleteClick} 
                          className="d-flex align-items-center gap-2 text-danger"
                        >
                          <span>🗑️</span>
                          Delete Player
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="d-flex gap-3 flex-wrap">
                    <div>
                      <strong>Age:</strong>
                      <Badge bg="info" className="ms-2">{player.age} years old</Badge>
                    </div>
                    <div>
                      <strong>Gender:</strong>
                      <Badge bg="secondary" className="ms-2">{player.Gender}</Badge>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-md-end">
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

        <EditPlayerModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onPlayerUpdated={handlePlayerUpdated}
          player={player}
          apiService={apiService}
        />      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" className="mb-3">
              {deleteError}
            </Alert>
          )}
          <p>
            Are you sure you want to delete <strong>{player.Name}</strong>?
          </p>
          <p className="text-muted small">
            This action cannot be undone. All assessment data for this player will also be deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Player'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlayerDetailPage;
