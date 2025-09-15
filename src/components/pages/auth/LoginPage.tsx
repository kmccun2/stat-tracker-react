import React from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaSignInAlt, FaChartBar } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="login-page">
      <Container fluid className="login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <FaChartBar className="login-icon mb-3" />
                  <h2 className="login-title">Stat Tracker</h2>
                  <p className="login-subtitle text-muted">
                    Track, analyze, and improve athletic performance
                  </p>
                </div>

                <div className="login-features mb-4">
                  <div className="feature-item">
                    <span className="feature-bullet">•</span>
                    Player performance analytics
                  </div>
                  <div className="feature-item">
                    <span className="feature-bullet">•</span>
                    Comprehensive assessment tools
                  </div>
                  <div className="feature-item">
                    <span className="feature-bullet">•</span>
                    Real-time progress tracking
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={login}
                  disabled={isLoading}
                  className="login-button w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      Login / Sign Up
                    </>
                  )}
                </Button>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Secure authentication powered by Auth0
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
