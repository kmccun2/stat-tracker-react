import React from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FaChartLine, FaChartBar, FaBullseye, FaPrint } from 'react-icons/fa';

const ReportsPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaChartLine /> Reports
              </h2>
              <p className="text-muted mb-0">View progress reports and analytics</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert variant="info" className="text-center">
            <Alert.Heading>Coming Soon!</Alert.Heading>
            <p>
              The Reports feature is planned for <strong>Phase 3</strong> of development.
              This will include:
            </p>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaChartLine /> Progress tracking over time
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaChartBar /> Visual charts and graphs
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaBullseye /> Goal achievement analytics
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2">
                <FaPrint /> Printable reports
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
                <FaChartLine /> Progress Charts
              </Card.Title>
              <Card.Text className="text-muted">
                Track player improvement over time with interactive charts showing assessment trends.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2">
                <FaBullseye /> Goal Analytics
              </Card.Title>
              <Card.Text className="text-muted">
                Analyze goal achievement rates across different assessment categories and age groups.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsPage;
