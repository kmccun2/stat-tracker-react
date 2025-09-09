import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Auth0Provider } from '@auth0/auth0-react';
import Papa from 'papaparse';
import AppLayout from './layout/AppLayout';
import PlayerListPage from './components/PlayerListPage';
import PlayerDetailPage from './components/PlayerDetailPage';
import ReportsPage from './components/ReportsPage';
import GoalsPage from './components/GoalsPage';
import SettingsPage from './components/SettingsPage';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import apiService from './services/apiService';
import auth0Config from './config/auth0Config';

function App() {
  const [players, setPlayers] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useBackend, setUseBackend] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Function to convert Excel serial date to JavaScript Date
  const excelSerialToDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1);
    const days = serial - 2; // Excel incorrectly treats 1900 as a leap year
    return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
  };

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = typeof dob === 'number' ? excelSerialToDate(dob) : new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Function to get age range for goals
  const getAgeRange = (age) => {
    if (age <= 12) return '12 or less';
    if (age >= 13 && age <= 14) return '13-14';
    if (age >= 15 && age <= 16) return '15-16';
    if (age >= 17 && age <= 18) return '17-18';
    return '18+';
  };

  // Load CSV data (fallback method)
  const loadCSVData = async () => {
    try {
      // Load players
      const playersResponse = await fetch('/players.csv');
      const playersText = await playersResponse.text();
      const playersData = Papa.parse(playersText, { header: true, skipEmptyLines: true });
      
      // Process players data to add age and age range
      const processedPlayers = playersData.data.map((player, index) => ({
        ...player,
        id: index + 1,
        age: calculateAge(parseInt(player.DOB)),
        ageRange: getAgeRange(calculateAge(parseInt(player.DOB)))
      }));
      
      // Load assessment types
      const assessmentTypesResponse = await fetch('/assessment-types.csv');
      const assessmentTypesText = await assessmentTypesResponse.text();
      const assessmentTypesData = Papa.parse(assessmentTypesText, { header: true, skipEmptyLines: true });
      
      // Load goals
      const goalsResponse = await fetch('/goals.csv');
      const goalsText = await goalsResponse.text();
      const goalsData = Papa.parse(goalsText, { header: true, skipEmptyLines: true });
      
      setPlayers(processedPlayers);
      setAssessmentTypes(assessmentTypesData.data);
      setGoals(goalsData.data);
    } catch (err) {
      console.error('Error loading CSV data:', err);
      throw new Error('Failed to load CSV data');
    }
  };

  // Load data from backend API
  const loadAPIData = async () => {
    try {
      // Load players
      const playersResponse = await apiService.getPlayers();
      const playersData = playersResponse.data.map(player => ({
        ...player,
        age: calculateAge(player.dob),
        ageRange: getAgeRange(calculateAge(player.dob))
      }));

      // Load assessment types
      const assessmentTypesResponse = await apiService.getAssessmentTypes();
      
      // Load goals
      const goalsResponse = await apiService.getGoals();

      // Load all assessment results
      const resultsMap = {};
      for (const player of playersData) {
        try {
          const playerAssessments = await apiService.getPlayerAssessments(player.id);
          playerAssessments.data.forEach(result => {
            resultsMap[`${player.id}-${result.assessment_type}`] = result.result_value;
          });
        } catch (err) {
          console.warn(`Could not load assessments for player ${player.id}:`, err);
        }
      }

      setPlayers(playersData);
      setAssessmentTypes(assessmentTypesResponse.data);
      setGoals(goalsResponse.data);
      setAssessmentResults(resultsMap);
    } catch (err) {
      console.error('Error loading API data:', err);
      throw new Error('Failed to load data from backend');
    }
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if backend is available
        const isBackendHealthy = await apiService.healthCheck();
        setBackendAvailable(isBackendHealthy);
        
        if (isBackendHealthy && useBackend) {
          console.log('Loading data from backend API...');
          await loadAPIData();
        } else {
          console.log('Loading data from CSV files...');
          await loadCSVData();
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [useBackend]);

  // Function to update assessment result
  const updateAssessmentResult = async (playerId, assessmentType, value) => {
    try {
      if (useBackend && backendAvailable) {
        // Save to backend
        await apiService.saveAssessmentResult({
          playerId: parseInt(playerId),
          assessmentType,
          resultValue: parseFloat(value)
        });
      }
      
      // Update local state
      setAssessmentResults(prev => ({
        ...prev,
        [`${playerId}-${assessmentType}`]: value
      }));
    } catch (err) {
      console.error('Error saving assessment result:', err);
      // Still update local state even if backend fails
      setAssessmentResults(prev => ({
        ...prev,
        [`${playerId}-${assessmentType}`]: value
      }));
    }
  };

  // Function to get assessment result
  const getAssessmentResult = (playerId, assessmentType) => {
    return assessmentResults[`${playerId}-${assessmentType}`] || '';
  };

  // Function to find goal for player/assessment
  const findGoal = (player, assessmentType) => {
    const goal = goals.find(g => 
      g.AssessmentType === assessmentType && 
      g.AgeRange === player.ageRange
    );
    
    if (!goal) return null;
    
    const genderGoal = player.Gender === 'Male' ? goal.MaleGoal : goal.FemaleGoal;
    const genderMinGoal = player.Gender === 'Male' ? goal.MaleMinGoal : goal.FemaleMinGoal;
    const genderMaxGoal = player.Gender === 'Male' ? goal.MaleMaxGoal : goal.FemaleMaxGoal;
    
    return {
      goal: genderGoal,
      minGoal: genderMinGoal,
      maxGoal: genderMaxGoal,
      lowIsGood: goal.LowIsGood === '1',
      unit: goal.Unit
    };
  };

  // Function to check if goal is met
  const isGoalMet = (player, assessmentType, result) => {
    if (!result || result === '') return null;
    
    const goalInfo = findGoal(player, assessmentType);
    if (!goalInfo) return null;
    
    const numResult = parseFloat(result);
    
    // If we have min and max goals, check if result is in range
    if (goalInfo.minGoal && goalInfo.maxGoal) {
      const minGoal = parseFloat(goalInfo.minGoal);
      const maxGoal = parseFloat(goalInfo.maxGoal);
      return numResult >= minGoal && numResult <= maxGoal;
    }
    
    // If we have a single goal, check based on lowIsGood
    if (goalInfo.goal) {
      const goal = parseFloat(goalInfo.goal);
      if (goalInfo.lowIsGood) {
        return numResult <= goal;
      } else {
        return numResult >= goal;
      }
    }
    
    return null;
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
    findGoal,
    isGoalMet,
    useBackend,
    setUseBackend,
    backendAvailable,
    apiService
  };

  return (
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
                  <ProtectedRoute requireAuth={false}>
                    <PlayerListPage />
                  </ProtectedRoute>
                } />
                <Route path="/player/:id" element={
                  <ProtectedRoute requireAuth={false}>
                    <PlayerDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute requireAuth={false}>
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute requireAuth={false}>
                    <GoalsPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requireAuth={false}>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </DataProvider>
    </Auth0Provider>
  );
}

export default App;
