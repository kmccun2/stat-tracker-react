import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb } from 'react-bootstrap';
import { FaArrowLeft, FaBaseballBall } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AssessmentTable from './AssessmentTable';
import ExportButton from './ExportButton';

const PlayerDetailPage = () => {
  const { id } = useParams();
  const { players } = useData();
  
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
      
      <AssessmentTable player={player} />
    </Container>
  );
};

export default PlayerDetailPage;
