import React, { memo, useEffect, useState } from "react";

// Icons
import { FaUsers } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";

// Components
import PageHeader from "../../common/page-header/PageHeader";
import LumexSpinner from "../../common/spinner/LumexSpinner";
import AddPlayerModal from "./AddPlayerModal";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Player } from "@/types/player";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";

// Constants
const EXAMPLE_COACH_ID = 1; // TODO: Replace with actual coach ID from auth context

/**
 * Actions component for the Players page header
 */
const PlayerActions: React.FC<{
  onAddPlayer: () => void;
}> = ({ onAddPlayer }) => (
  <button
    className="lumex-btn primary"
    onClick={onAddPlayer}
    aria-label="Add new player"
  >
    <HiOutlineUserAdd />
    <span className="ms-2">Add Player</span>
  </button>
);

/**
 * PlayersPage Component
 * Manages the team roster and displays player information
 */

const PlayersPage: React.FC = memo(() => {
  // State management
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  // Hooks
  const { getPlayersByCoachId } = useAPI();
  const dispatch = useAppDispatch();

  // Event handlers
  const handleAddPlayerClick = () => {
    setShowAddPlayerModal(true);
  };

  const handleCloseModal = () => {
    setShowAddPlayerModal(false);
  };

  const showErrorToast = (message: string) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title: "Error Fetching Players",
        message,
        type: "error",
      } as ToastItemType)
    );
  };

  // Data fetching
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const fetchedPlayers = await getPlayersByCoachId(EXAMPLE_COACH_ID);
      setPlayers(fetchedPlayers);
      console.log("Players fetched:", fetchedPlayers);
    } catch (error) {
      console.error("Error fetching players:", error);
      showErrorToast("Failed to fetch players.");
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Render methods
  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-100 w-100">
          <LumexSpinner />
        </div>
      );
    }

    return (
      <div className="page-main-content">
        <p>Total Players: {players.length}</p>
        {/* TODO: Add players list/grid component here */}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Players"
        subtitle="Manage your team roster and track individual progress"
        icon={<FaUsers />}
        actions={<PlayerActions onAddPlayer={handleAddPlayerClick} />}
      />

      {/* Main Content */}
      {renderContent()}

      <AddPlayerModal show={showAddPlayerModal} onClose={handleCloseModal} />
    </>
  );
});

// Add display name for debugging
PlayersPage.displayName = "PlayersPage";

export default PlayersPage;
