// Hooks
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";
import { Player } from "../types/player";
import { Metric, Category } from "../types/metric";

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
    { category: string; categorySort: number }[]
  > => {
    ensureAuthenticated();
    const response = await apiService.getMetricCategories();
    return response.data || [];
  }, [ensureAuthenticated]);

  const addMetric = useCallback(
    async (metricData: {
      metric: string;
      description: string;
      categoryId: number;
      isActive: boolean;
    }): Promise<Metric> => {
      ensureAuthenticated();
      const response = await apiService.addMetric(metricData);
      return response.data;
    },
    [ensureAuthenticated]
  );

  // Cateegory CRUD operation
  const getCategories = useCallback(async (): Promise<Category[]> => {
    ensureAuthenticated();
    const response = await apiService.getCategories();
    return response.data || [];
  }, [ensureAuthenticated]);

  return {
    // Player methods
    getPlayersByCoachId,
    addPlayer,
    // Metric methods
    getAllMetrics,
    getMetricCategories,
    addMetric,
    // Category methods
    getCategories,
  };
};
