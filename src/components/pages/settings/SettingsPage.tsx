import React from "react";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";
import {
  FaCog,
  FaUser,
  FaLock,
  FaDatabase,
  FaPalette,
  FaFileImport,
} from "react-icons/fa";

const SettingsPage: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaCog /> Settings
              </h2>
              <p className="text-muted mb-0">
                Configure application preferences and data sources
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert variant="info" className="text-center">
            <Alert.Heading>Additional Settings Coming Soon!</Alert.Heading>
            <p>More configuration options planned for future development:</p>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaUser /> Coach profile management
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaLock /> Authentication settings
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaFileImport /> Data import/export options
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2">
                <FaPalette /> UI customization
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
                <FaUser /> User Management
              </Card.Title>
              <Card.Text className="text-muted">
                Manage coach profiles, authentication, and access permissions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2">
                <FaDatabase /> Data Management
              </Card.Title>
              <Card.Text className="text-muted">
                Import/export data, backup settings, and configure data sources.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
