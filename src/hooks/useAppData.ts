import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { calculateAge, getAgeRange } from '../utils/ageCalculation';
import type { Player, AssessmentType, Goal, AssessmentResult } from '../types';

interface UseAppDataReturn {
  // State
  players: Player[];
  assessmentTypes: AssessmentType[];
  goals: Goal[];
  assessmentResults: Record<string, string | number>;
  loading: boolean;
  error: string | null;
  useBackend: boolean;
  
  // Actions
  updateAssessmentResult: (playerId: string, assessmentType: string, value: string | number) => Promise<void>;
  getAssessmentResult: (playerId: string, assessmentType: string) => string | number;
  addPlayer: (newPlayer: any) => void;
  updatePlayer: (updatedPlayer: any) => void;
  deletePlayer: (playerId: any) => void;
  addAssessmentType: (newType: any) => void;
  updateAssessmentType: (updatedType: any) => void;
  deleteAssessmentType: (typeId: any) => void;
  
  // Utility
  apiService: typeof apiService;
}

/**
 * Custom hook for managing application data loading and state
 * Extracts complex data loading logic from App.tsx
 */
export const useAppData = (): UseAppDataReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [metrics, setMetrics] = useState<AssessmentType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend API
  const loadAPIData = async (): Promise<void> => {
    try {
      // Load players
      const playersResponse = await apiService.getPlayers();
      const playersData = playersResponse.data.map((player: any) => ({
        ...player,
        age: calculateAge(player.dob),
        ageRange: getAgeRange(calculateAge(player.dob))
      }));

      // Load metrics
      const metricsResponse = await apiService.getMetrics();
      
      // Load goals
      const goalsResponse = await apiService.getGoals();

      // Load all assessment results
      const resultsMap: Record<string, string | number> = {};
      for (const player of playersData) {
        try {
          const playerAssessments = await apiService.getPlayerAssessments(player.id);
          playerAssessments.data.forEach((result: any) => {
            resultsMap[`${player.id}-${result.metric}`] = result.result_value;
          });
        } catch (err) {
          console.warn(`Could not load assessments for player ${player.id}:`, err);
        }
      }

      setPlayers(playersData);
      setMetrics(metricsResponse.data);
      setGoals(goalsResponse.data);
      setAssessmentResults(resultsMap);
    } catch (err) {
      console.error('Error loading API data:', err);
      throw new Error('Failed to load data from backend');
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
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
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to update assessment result
  const updateAssessmentResult = async (playerId: string, assessmentType: string, value: string | number): Promise<void> => {
    try {
      // Save to backend
      await apiService.saveAssessmentResult({
        playerId: parseInt(playerId),
        assessmentType,
        resultValue: parseFloat(value.toString())
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
  const getAssessmentResult = (playerId: string, assessmentType: string): string | number => {
    return assessmentResults[`${playerId}-${assessmentType}`] || '';
  };

  // Function to add a new player
  const addPlayer = (newPlayer: any): void => {
    setPlayers(prev => [...prev, newPlayer]);
  };

  // Function to update a player
  const updatePlayer = (updatedPlayer: any): void => {
    setPlayers(prev => prev.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
  };

  // Function to delete a player
  const deletePlayer = (playerId: any): void => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  // Assessment type management functions
  const addAssessmentType = (newType: any): void => {
    setMetrics(prev => [...prev, newType]);
  };

  const updateAssessmentType = (updatedType: any): void => {
    setMetrics(prev => prev.map(type => 
      type.id === updatedType.id ? updatedType : type
    ));
  };

  const deleteAssessmentType = (typeId: any): void => {
    setMetrics(prev => prev.filter(type => type.id !== typeId));
  };

  return {
    // State
    players,
    assessmentTypes: metrics, // Alias for backward compatibility
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
