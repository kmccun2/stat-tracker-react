import "./PlayersPage.scss";
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
import { useAuth } from "../../../context/AuthContext";
import { calculateAge } from "@/utils/ageCalculation";
import TableCardToggle from "@/components/common/table-card-toggle/TableCardToggle";

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
  const [playerView, setPlayerView] = useState<"cards" | "table">("cards");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const { userProfile } = useAuth();

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
      const fetchedPlayers = await getPlayersByCoachId(userProfile!.id);
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
    if (!userProfile?.id) return;
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.id]); // Empty dependency array - only run once on mount

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
        {/* Players actions header  */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search players..."
          />
          <TableCardToggle />
        </div>

        {/* Player cards */}
        {players.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No players found. Click "Add Player" to create a new player profile.
          </div>
        ) : (
          <div className="player-list">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                <h5>{player.firstName + " " + player.lastName}</h5>
                <p>
                  {player.dob
                    ? `${calculateAge(player.dob)} years old`
                    : "Age not available"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Player table */}
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
