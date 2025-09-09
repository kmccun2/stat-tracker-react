import React from 'react';
import { Card, Form, Badge, Alert } from 'react-bootstrap';
import { FaDatabase, FaFileCsv, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const BackendToggle = () => {
  const { useBackend, setUseBackend, backendAvailable } = useData();

  const handleToggle = (e) => {
    setUseBackend(e.target.checked);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-2 d-flex align-items-center gap-2">
              <FaDatabase /> Data Source Configuration
            </h6>
            <p className="text-muted mb-0 small">
              Choose between CSV files (Phase 1) or Database (Phase 2)
            </p>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <div className="small text-muted">Backend Status:</div>
              <Badge bg={backendAvailable ? 'success' : 'danger'} className="d-flex align-items-center gap-1">
                {backendAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
                {backendAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            
            <Form.Check
              type="switch"
              id="backend-toggle"
              label=""
              checked={useBackend}
              onChange={handleToggle}
              disabled={!backendAvailable}
              style={{ fontSize: '1.2em' }}
            />
          </div>
        </div>
        
        <div className="mt-3">
          {useBackend ? (
            <Alert variant="success" className="mb-0 py-2">
              <div className="d-flex align-items-center gap-2">
                <FaDatabase />
                <strong>Database Mode:</strong> 
                <span>Data persisted to SQLite database with authentication support</span>
              </div>
            </Alert>
          ) : (
            <Alert variant="info" className="mb-0 py-2">
              <div className="d-flex align-items-center gap-2">
                <FaFileCsv />
                <strong>CSV Mode:</strong> 
                <span>Data loaded from CSV files (changes saved in browser memory only)</span>
              </div>
            </Alert>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BackendToggle;
