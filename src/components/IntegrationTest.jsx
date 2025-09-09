import React, { useState } from 'react';
import { Card, Button, Alert, Badge, Table, Spinner } from 'react-bootstrap';
import { FaPlay, FaCheckCircle, FaTimesCircle, FaDatabase, FaFileCsv } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const IntegrationTest = () => {
  const { apiService, backendAvailable, useBackend, players, assessmentTypes, goals } = useData();
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = [];

    // Test 1: Backend Health Check
    try {
      const health = await apiService.healthCheck();
      results.push({
        test: 'Backend Health Check',
        status: health ? 'pass' : 'fail',
        message: health ? 'Backend is responding' : 'Backend is not responding'
      });
    } catch (error) {
      results.push({
        test: 'Backend Health Check',
        status: 'fail',
        message: error.message
      });
    }

    // Test 2: Players API
    try {
      const playersResponse = await apiService.getPlayers();
      results.push({
        test: 'Players API',
        status: playersResponse.success ? 'pass' : 'fail',
        message: `Loaded ${playersResponse.data?.length || 0} players`
      });
    } catch (error) {
      results.push({
        test: 'Players API',
        status: 'fail',
        message: error.message
      });
    }

    // Test 3: Assessment Types API
    try {
      const assessmentResponse = await apiService.getAssessmentTypes();
      results.push({
        test: 'Assessment Types API',
        status: assessmentResponse.success ? 'pass' : 'fail',
        message: `Loaded ${assessmentResponse.data?.length || 0} assessment types`
      });
    } catch (error) {
      results.push({
        test: 'Assessment Types API',
        status: 'fail',
        message: error.message
      });
    }

    // Test 4: Goals API
    try {
      const goalsResponse = await apiService.getGoals();
      results.push({
        test: 'Goals API',
        status: goalsResponse.success ? 'pass' : 'fail',
        message: `Loaded ${goalsResponse.data?.length || 0} goals`
      });
    } catch (error) {
      results.push({
        test: 'Goals API',
        status: 'fail',
        message: error.message
      });
    }

    // Test 5: Sample Assessment Result Save
    if (players.length > 0) {
      try {
        const testResult = await apiService.saveAssessmentResult({
          playerId: players[0].id,
          assessmentType: 'Exit Velocity',
          resultValue: 85.5
        });
        results.push({
          test: 'Save Assessment Result',
          status: testResult.success ? 'pass' : 'fail',
          message: testResult.success ? 'Successfully saved test assessment' : 'Failed to save assessment'
        });
      } catch (error) {
        results.push({
          test: 'Save Assessment Result',
          status: 'fail',
          message: error.message
        });
      }
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <FaCheckCircle className="text-success" />;
      case 'fail':
        return <FaTimesCircle className="text-danger" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pass':
        return <Badge bg="success">PASS</Badge>;
      case 'fail':
        return <Badge bg="danger">FAIL</Badge>;
      default:
        return <Badge bg="secondary">UNKNOWN</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 d-flex align-items-center gap-2">
            <FaDatabase /> Integration Test Suite
          </h6>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={runTests}
            disabled={testing}
            className="d-flex align-items-center gap-2"
          >
            {testing ? (
              <>
                <Spinner animation="border" size="sm" />
                Testing...
              </>
            ) : (
              <>
                <FaPlay />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Alert variant={backendAvailable ? 'success' : 'warning'} className="py-2 mb-0">
            <div className="d-flex align-items-center gap-2">
              {useBackend ? <FaDatabase /> : <FaFileCsv />}
              <strong>Current Mode:</strong>
              {useBackend ? 'Database Backend' : 'CSV Files'}
              <span className="ms-2">
                Backend: {backendAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </Alert>
        </div>

        <div className="mb-3">
          <h6>Current Data Status:</h6>
          <div className="row text-center">
            <div className="col">
              <div className="text-primary fw-bold">{players.length}</div>
              <small className="text-muted">Players</small>
            </div>
            <div className="col">
              <div className="text-info fw-bold">{assessmentTypes.length}</div>
              <small className="text-muted">Assessment Types</small>
            </div>
            <div className="col">
              <div className="text-success fw-bold">{goals.length}</div>
              <small className="text-muted">Goals</small>
            </div>
          </div>
        </div>

        {testResults.length > 0 && (
          <div>
            <h6>Test Results:</h6>
            <Table striped size="sm">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index}>
                    <td className="d-flex align-items-center gap-2">
                      {getStatusIcon(result.status)}
                      {result.test}
                    </td>
                    <td>{getStatusBadge(result.status)}</td>
                    <td>{result.message}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {testResults.length === 0 && (
          <Alert variant="info" className="text-center mb-0">
            Click "Run Tests" to verify backend integration functionality
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default IntegrationTest;
