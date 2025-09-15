// Hooks
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";
import { Player } from "../types/player";
import { Metric } from "../types/metric";

export const useAPI = () => {
  const { isAuthenticated } = useAuth();

  // Helper function to ensure authentication
  const ensureAuthenticated = useCallback(() => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to perform this action");
    }
  }, [isAuthenticated]);

  // Player CRUD operations
  const getPlayersByCoachId = useCallback(
    async (coachId: number): Promise<Player[]> => {
      ensureAuthenticated();
      const response = await apiService.getPlayersByCoachId(coachId);
      return response.data || [];
    },
    [ensureAuthenticated]
  );

  const addPlayer = useCallback(
    async (playerData: Player): Promise<Player> => {
      ensureAuthenticated();
      let response = await apiService.addPlayer(playerData);
      return response.data;
    },
    [ensureAuthenticated]
  );

  // Metric CRUD operations
  const getAllMetrics = useCallback(async (): Promise<Metric[]> => {
    ensureAuthenticated();
    const response = await apiService.getAllMetrics();
    return response.data || [];
  }, [ensureAuthenticated]);

  const getMetricCategories = useCallback(async (): Promise<
    { category: string; category_sort: number }[]
  > => {
    ensureAuthenticated();
    const response = await apiService.getMetricCategories();
    return response.data || [];
  }, [ensureAuthenticated]);

  const addMetric = useCallback(
    async (metricData: {
      metric: string;
      category: string;
      metric_sort: number;
      category_sort: number;
    }): Promise<Metric> => {
      ensureAuthenticated();
      const response = await apiService.addMetric(metricData);
      return response.data;
    },
    [ensureAuthenticated]
  );

  return {
    // Player methods
    getPlayersByCoachId,
    addPlayer,
    // Metric methods
    getAllMetrics,
    getMetricCategories,
    addMetric,
  };
};
