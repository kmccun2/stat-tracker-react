import React from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FaBullseye, FaUser, FaTable, FaHistory, FaClipboardList } from 'react-icons/fa';

const GoalsPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaBullseye /> Goals Management
              </h2>
              <p className="text-muted mb-0">Customize assessment goals per player</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert variant="info" className="text-center">
            <Alert.Heading>Coming Soon!</Alert.Heading>
            <p>
              The Goals Management feature is planned for <strong>Phase 2</strong> of development.
              This will include:
            </p>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaUser /> Custom goals per player
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaTable /> Override default age/gender goals
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaClipboardList /> Bulk goal management
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2">
                <FaHistory /> Goal history tracking
              </li>
            </ul>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2">
                <FaUser /> Player-Specific Goals
              </Card.Title>
              <Card.Text className="text-muted">
                Set custom goals for individual players that override the default age/gender targets.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2">
                <FaClipboardList /> Goal Templates
              </Card.Title>
              <Card.Text className="text-muted">
                Create and manage goal templates for different player types and skill levels.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GoalsPage;
