import "./PlayersPage.scss";
import React, { memo, useEffect, useState } from "react";

// Icons
import { FaUsers } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";

// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

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
  const [view, setView] = useState<"cards" | "table">("cards");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof Player>("firstName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
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

  // Sorting functionality
  const handleRequestSort = (property: keyof Player) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPlayers = players.slice().sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (orderBy === "firstName" || orderBy === "lastName") {
      aValue = a[orderBy]?.toLowerCase() || "";
      bValue = b[orderBy]?.toLowerCase() || "";
    } else if (orderBy === "dob") {
      aValue = a.dob?.valueOf() || 0;
      bValue = b.dob?.valueOf() || 0;
    } else {
      aValue = a[orderBy];
      bValue = b[orderBy];
    }

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Effects
  useEffect(() => {
    if (!userProfile?.id) return;
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.id]); // Empty dependency array - only run once on mount

  // Render helpers
  const PlayerCards = () => (
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
  );

  const PlayerTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="players table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "firstName"}
                direction={orderBy === "firstName" ? order : "asc"}
                onClick={() => handleRequestSort("firstName")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "dob"}
                direction={orderBy === "dob" ? order : "asc"}
                onClick={() => handleRequestSort("dob")}
              >
                Age
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player) => (
            <TableRow
              key={player.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {`${player.firstName} ${player.lastName}`}
              </TableCell>
              <TableCell align="right">
                {player.dob ? `${calculateAge(player.dob)} years old` : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <PageHeader
        title="Players"
        subtitle="Manage your team roster and track individual progress"
        icon={<FaUsers />}
        actions={<PlayerActions onAddPlayer={handleAddPlayerClick} />}
      />

      {/* Main Content */}
      {loading && (
        <div className="h-100 w-100">
          <LumexSpinner />
        </div>
      )}

      {!loading && (
        <div className="page-main-content">
          {/* Players actions header  */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search players..."
            />
            <TableCardToggle view={view} setView={setView} />
          </div>

          {/* Player cards */}
          {players.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No players found. Click "Add Player" to create a new player
              profile.
            </div>
          ) : (
            <>{view === "cards" ? <PlayerCards /> : <PlayerTable />}</>
          )}
        </div>
      )}

      <AddPlayerModal show={showAddPlayerModal} onClose={handleCloseModal} />
    </>
  );
});

// Add display name for debugging
PlayersPage.displayName = "PlayersPage";

export default PlayersPage;
