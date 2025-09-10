import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="text-center" style={{ maxWidth: '600px' }}>
            <Alert variant="danger" className="p-4">
              <div className="mb-3">
                <FaExclamationTriangle size={48} className="text-danger mb-3" />
                <Alert.Heading>Oops! Something went wrong</Alert.Heading>
              </div>
              
              <p className="mb-3">
                We're sorry, but something unexpected happened. This error has been logged 
                and we'll work to fix it as soon as possible.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-3">
                  <details className="text-start">
                    <summary className="btn btn-outline-danger btn-sm mb-2">
                      Show Error Details (Development Mode)
                    </summary>
                    <pre className="text-danger small bg-light p-2 rounded">
                      {this.state.error && this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}

              <div className="d-flex gap-2 justify-content-center mt-4">
                <Button variant="primary" onClick={this.handleReset}>
                  <FaHome className="me-1" />
                  Try Again
                </Button>
                <Button variant="outline-primary" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </Alert>

            <div className="mt-3 text-muted small">
              <p>If this problem persists, please contact support with the error details above.</p>
            </div>
          </div>
        </Container>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
