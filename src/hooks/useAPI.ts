// Hooks
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";
import { Player } from "../types/player";

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
    async (playerData: Player): Promise<void> => {
      ensureAuthenticated();
      await apiService.addPlayer(playerData);
    },
    [ensureAuthenticated]
  );

  return {
    // Player methods
    getPlayersByCoachId,
    addPlayer,
  };
};
