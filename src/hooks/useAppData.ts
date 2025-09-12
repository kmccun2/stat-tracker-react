// React hooks for state management and side effects
import { useState, useEffect } from 'react';

// API service for backend communication
import apiService from '../services/apiService';

// Utility functions for age calculations
import { calculateAge, getAgeRange } from '../utils/ageCalculation';

// TypeScript type definitions
import type { Player, AssessmentType, Goal } from '../types';

/**
 * Return type interface for the useAppData hook
 * Defines all state and functions exposed by this hook
 */
interface UseAppDataReturn {
  // Application state
  players: Player[];
  assessmentTypes: AssessmentType[];
  goals: Goal[];
  assessmentResults: Record<string, string | number>;
  loading: boolean;
  error: string | null;
  useBackend: boolean;
  
  // CRUD operations for players and assessments
  updateAssessmentResult: (playerId: string, assessmentType: string, value: string | number) => Promise<void>;
  getAssessmentResult: (playerId: string, assessmentType: string) => string | number;
  addPlayer: (newPlayer: any) => void;
  updatePlayer: (updatedPlayer: any) => void;
  deletePlayer: (playerId: any) => void;
  addAssessmentType: (newType: any) => void;
  updateAssessmentType: (updatedType: any) => void;
  deleteAssessmentType: (typeId: any) => void;
  
  // Utility services
  apiService: typeof apiService;
}

/**
 * useAppData Hook
 * 
 * Custom hook that manages all application data loading and state management.
 * Provides a centralized way to handle:
 * - Initial data loading from the backend API
 * - Player, assessment type, and goal CRUD operations
 * - Assessment result management
 * - Loading and error states
 * 
 * This hook abstracts complex data management logic from components,
 * making it easier to maintain and test the application state.
 * 
 * @returns UseAppDataReturn - Complete application state and operations
 */
export const useAppData = (): UseAppDataReturn => {
  // Core application state
  const [players, setPlayers] = useState<Player[]>([]);
  const [metrics, setMetrics] = useState<AssessmentType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load data from backend API
   * Fetches all necessary data for the application including players,
   * metrics, goals, and assessment results
   */
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

  /**
   * Update assessment result for a player
   * Saves the result to the backend and updates local state
   */
  const updateAssessmentResult = async (playerId: string, assessmentType: string, value: string | number): Promise<void> => {
    try {
      // Save to backend
      await apiService.saveAssessmentResult({
        playerId: parseInt(playerId),
        metric: assessmentType, // Use 'metric' as expected by the API
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
