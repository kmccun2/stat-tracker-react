import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Auth0Provider } from '@auth0/auth0-react';
import AppLayout from './layout/AppLayout';
import PlayerListPage from './components/PlayerListPage';
import PlayerDetailPage from './components/PlayerDetailPage';
import MetricsPage from './components/MetricsPage';
import ReportsPage from './components/ReportsPage';
import GoalsPage from './components/GoalsPage';
import SettingsPage from './components/SettingsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import auth0Config from './config/auth0Config';
import { findGoal, isGoalMet } from './utils/goalResolution';
import { useAppData } from './hooks/useAppData';

function App() {
  // Use custom hook for data management
  const {
    players,
    assessmentTypes,
    goals,
    loading,
    error,
    updateAssessmentResult,
    getAssessmentResult,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addAssessmentType,
    updateAssessmentType,
    deleteAssessmentType,
    useBackend,
    apiService
  } = useAppData();

  // Function to find goal for player/assessment
  const findGoalForPlayer = (player, assessmentType) => {
    return findGoal(player, assessmentType, goals);
  };

  // Function to check if goal is met
  const isGoalMetForPlayer = (player, assessmentType, result) => {
    return isGoalMet(player, assessmentType, result, goals);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3>Loading stat tracker...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </Container>
    );
  }

  const contextValue = {
    players,
    assessmentTypes,
    goals,
    updateAssessmentResult,
    getAssessmentResult,
    findGoal: findGoalForPlayer,
    isGoalMet: isGoalMetForPlayer,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addAssessmentType,
    updateAssessmentType,
    deleteAssessmentType,
    loading,
    useBackend,
    apiService
  };

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
          redirect_uri: auth0Config.redirectUri,
          audience: auth0Config.audience,
          scope: auth0Config.scope
        }}
        useRefreshTokens={auth0Config.useRefreshTokens}
        cacheLocation={auth0Config.cacheLocation}
      >
        <DataProvider value={contextValue}>
          <AuthProvider>
            <Router>
              <AppLayout>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute requireAuth={true}>
                    <PlayerListPage />
                  </ProtectedRoute>
                } />
                <Route path="/player/:id" element={
                  <ProtectedRoute requireAuth={true}>
                    <PlayerDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requireAuth={true}>
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/metrics" element={
                  <ProtectedRoute requireAuth={true}>
                    <MetricsPage />
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute requireAuth={true}>
                    <GoalsPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requireAuth={true}>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </DataProvider>
    </Auth0Provider>
    </ErrorBoundary>
  );
}

export default App;
