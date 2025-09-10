import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { calculateAge, getAgeRange } from '../utils/ageCalculation';

/**
 * Custom hook for managing application data loading and state
 * Extracts complex data loading logic from App.jsx
 */
export const useAppData = () => {
  const [players, setPlayers] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if backend is available and load data
        const isBackendHealthy = await apiService.healthCheck();
        
        if (isBackendHealthy) {
          await loadAPIData();
        } else {
          throw new Error('Backend server is not available. Please ensure the backend server is running and try again.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to update assessment result
  const updateAssessmentResult = async (playerId, assessmentType, value) => {
    try {
      // Save to backend
      await apiService.saveAssessmentResult({
        playerId: parseInt(playerId),
        assessmentType,
        resultValue: parseFloat(value)
      });
      
      // Update local state
      setAssessmentResults(prev => ({
        ...prev,
        [`${playerId}-${assessmentType}`]: value
      }));
    } catch (err) {
      console.error('Error saving assessment result:', err);
      throw new Error('Failed to save assessment result to database');
    }
  };

  // Function to get assessment result
  const getAssessmentResult = (playerId, assessmentType) => {
    return assessmentResults[`${playerId}-${assessmentType}`] || '';
  };

  // Function to add a new player
  const addPlayer = (newPlayer) => {
    setPlayers(prev => [...prev, newPlayer]);
  };

  // Function to update a player
  const updatePlayer = (updatedPlayer) => {
    setPlayers(prev => prev.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
  };

  // Function to delete a player
  const deletePlayer = (playerId) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  // Assessment type management functions
  const addAssessmentType = (newType) => {
    setAssessmentTypes(prev => [...prev, newType]);
  };

  const updateAssessmentType = (updatedType) => {
    setAssessmentTypes(prev => prev.map(type => 
      type.id === updatedType.id ? updatedType : type
    ));
  };

  const deleteAssessmentType = (typeId) => {
    setAssessmentTypes(prev => prev.filter(type => type.id !== typeId));
  };

  return {
    // State
    players,
    assessmentTypes,
    goals,
    assessmentResults,
    loading,
    error,
    useBackend: true, // Always use backend
    
    // Actions
    updateAssessmentResult,
    getAssessmentResult,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addAssessmentType,
    updateAssessmentType,
    deleteAssessmentType,
    
    // Utility
    apiService
  };
};
