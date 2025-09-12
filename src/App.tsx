// React core imports
import React from "react";

// Third-party library imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Auth0Provider } from "@auth0/auth0-react";

// Layout and shared components
import AppLayout from "./layout/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Page components
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import PlayerListPage from "./components/pages/players/PlayerListPage";
import PlayerDetailPage from "./components/pages/players/PlayerDetailPage";
import MetricsPage from "./components/pages/metrics/MetricsPage";
import AnalyticsPage from "./components/pages/analytics/AnalyticsPage";
import GoalsPage from "./components/pages/goals/GoalsPage";
import SettingsPage from "./components/pages/settings/SettingsPage";
import AssessmentSelectionPage from "./components/pages/assessments/AssessmentSelectionPage";

// Context providers
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";

// Configuration
import auth0Config from "./config/auth0Config";

// Hooks
import { useAppData } from "./hooks/useAppData";

// Utilities
import { findGoal, isGoalMet } from "./utils/goalResolution";

// Type definitions
import type { Player, AssessmentType, DataContextType } from "./types";

function App(): JSX.Element {
  // Initialize data and state management using custom hook
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
    apiService,
  } = useAppData();

  // Helper functions for goal management
  const findGoalForPlayer = (
    player: Player,
    assessmentType: AssessmentType
  ) => {
    return findGoal(player, assessmentType, goals);
  };

  // Function to check if goal is met
  const isGoalMetForPlayer = (
    player: Player,
    assessmentType: AssessmentType,
    result: number
  ): boolean | null => {
    return isGoalMet(player, assessmentType, result, goals);
  };

  // Loading state UI
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3>Loading stat tracker...</h3>
        </div>
      </Container>
    );
  }

  // Error state UI
  if (error) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </Container>
    );
  }

  // Prepare context value for data provider
  const contextValue: DataContextType = {
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
    apiService,
  };

  // Main application render with provider hierarchy and routing
  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
          redirect_uri: auth0Config.redirectUri,
          audience: auth0Config.audience,
          scope: auth0Config.scope,
        }}
        useRefreshTokens={auth0Config.useRefreshTokens}
        cacheLocation={auth0Config.cacheLocation}
      >
        <DataProvider value={contextValue}>
          <AuthProvider>
            <Router>
              <AppLayout>
                <Routes>
                  {/* Dashboard - Main entry point */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Assessment workflow */}
                  <Route
                    path="/assessment-selection"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <AssessmentSelectionPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Player management */}
                  <Route
                    path="/players"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <PlayerListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/player/:id"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <PlayerDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Analytics and reporting */}
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Configuration and management */}
                  <Route
                    path="/metrics"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <MetricsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <GoalsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
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
