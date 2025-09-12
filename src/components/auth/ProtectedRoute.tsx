import React, { ReactNode } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FaLock, FaBaseballBall } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import LoginButton from "./LoginButton";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading, error } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Checking authentication...</h5>
          <p className="text-muted">
            Please wait while we verify your credentials
          </p>
        </div>
      </Container>
    );
  }

  // Show error if authentication failed
  if (error) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger">
              <Alert.Heading>Authentication Error</Alert.Heading>
              <p>There was an error with authentication: {error.message}</p>
              <hr />
              <div className="d-flex justify-content-center">
                <LoginButton variant="primary" size="lg" />
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  // If authentication is required but user is not authenticated, show login prompt
  if (requireAuth && !isAuthenticated) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="text-center border-0 shadow">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <FaLock size={48} className="text-primary mb-3" />
                  <h3 className="mb-3">
                    <FaBaseballBall className="me-2 text-primary" />
                    Baseball Stat Tracker
                  </h3>
                </div>

                <h4 className="mb-3">Welcome, Coach!</h4>
                <p className="text-muted mb-4">
                  Please sign in to access your team's performance data, track
                  player progress, and generate detailed reports.
                </p>

                <div className="mb-4">
                  <LoginButton variant="primary" size="lg" />
                </div>

                <div className="text-muted small">
                  <strong>New to the platform?</strong>
                  <br />
                  Click "Login / Sign Up" to create your coach account and start
                  tracking player development.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // User is authenticated (or authentication not required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
