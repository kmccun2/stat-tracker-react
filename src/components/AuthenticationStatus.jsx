import React from 'react';
import { Card, Badge, Alert, Table } from 'react-bootstrap';
import { FaUser, FaCheckCircle, FaTimesCircle, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AuthenticationStatus = () => {
  const { isAuthenticated, user, userProfile, isLoading, error } = useAuth();

  return (
    <Card className="mb-4">
      <Card.Header>
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <FaShieldAlt /> Authentication Status
        </h6>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Alert variant={isAuthenticated ? 'success' : 'info'} className="py-2 mb-0">
            <div className="d-flex align-items-center gap-2">
              {isAuthenticated ? <FaCheckCircle /> : <FaTimesCircle />}
              <strong>Status:</strong>
              {isLoading ? (
                'Checking authentication...'
              ) : isAuthenticated ? (
                'Authenticated with Auth0'
              ) : (
                'Not authenticated'
              )}
            </div>
          </Alert>
        </div>

        {error && (
          <Alert variant="danger" className="py-2 mb-3">
            <strong>Authentication Error:</strong> {error.message}
          </Alert>
        )}

        {isAuthenticated && user && (
          <div>
            <h6>User Information:</h6>
            <Table size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{user.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{user.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Provider:</strong></td>
                  <td>
                    <Badge bg="primary">Auth0</Badge>
                  </td>
                </tr>
                <tr>
                  <td><strong>User ID:</strong></td>
                  <td>
                    <code className="small">{user.sub}</code>
                  </td>
                </tr>
                {userProfile && (
                  <tr>
                    <td><strong>Profile Status:</strong></td>
                    <td>
                      <Badge bg="success">
                        <FaCheckCircle className="me-1" />
                        Profile Created
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {!isAuthenticated && !isLoading && (
          <Alert variant="info" className="py-2 mb-0">
            <div className="d-flex align-items-center gap-2">
              <FaUser />
              <span>
                Click "Login / Sign Up" in the header to authenticate with Auth0 and access advanced features.
              </span>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default AuthenticationStatus;
