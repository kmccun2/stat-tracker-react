// React Router for client-side routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// React Bootstrap UI components and Auth0 React SDK for authentication
import { Auth0Provider } from "@auth0/auth0-react";

// Layout and error handling components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Page components - organized by feature area
import AnalyticsPage from "./components/pages/analytics/AnalyticsPage";
import AssessmentsPage from "./components/pages/assessments/AssessmentsPage";
import NewAssessmentPage from "./components/pages/assessments/new-assessment/BuildYourOwnAssessment";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import MetricsPage from "./components/pages/metrics/MetricsPage";
import PlayersPage from "./components/pages/players/PlayersPage";
import SettingsPage from "./components/pages/settings/SettingsPage";
import LoginPage from "./components/pages/auth/LoginPage";

// React Context providers for state management
import auth0Config from "./config/auth0Config";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Configuration files
import AppLayout from "./layout/AppLayout";

// TypeScript type definitions
import { ReduxProvider } from "./providers/ReduxProvider";
import BuildYourOwnAssessment from "./components/pages/assessments/new-assessment/BuildYourOwnAssessment";
import ComingSoonAssessment from "./components/pages/assessments/new-assessment/assessment-types/ComingSoonAssessment";
import PlayerPage from "./components/pages/players/player-page/PlayerPage";

// Main application component that handles authentication flow
function AppContent(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main application with layout if user is authenticated
  return (
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
          path="/assessments"
          element={
            <ProtectedRoute requireAuth={true}>
              <AssessmentsPage />
            </ProtectedRoute>
          }
        />
        {/* New assessment pages */}
        <Route
          path="/assessments/new/build-your-own"
          element={
            <ProtectedRoute requireAuth={true}>
              <BuildYourOwnAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/new/coming-soon"
          element={
            <ProtectedRoute requireAuth={true}>
              <ComingSoonAssessment />
            </ProtectedRoute>
          }
        />
        {/* Player management */}
        <Route
          path="/players"
          element={
            <ProtectedRoute requireAuth={true}>
              <PlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:playerId"
          element={
            <ProtectedRoute requireAuth={true}>
              <PlayerPage />
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
          path="/settings"
          element={
            <ProtectedRoute requireAuth={true}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}

function App(): JSX.Element {
  // Main application render with provider hierarchy and routing
  return (
    <ReduxProvider>
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
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </Auth0Provider>
      </ErrorBoundary>
    </ReduxProvider>
  );
}

export default App;
