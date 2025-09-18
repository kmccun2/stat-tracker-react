import "./PlayersPage.scss";
import React, { memo, useEffect, useState } from "react";

// Icons
import { FaUsers } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";
import TableCardToggle from "@/components/common/table-card-toggle/TableCardToggle";
import { FaBaseballBatBall, FaDumbbell } from "react-icons/fa6";
import { IoMdStopwatch } from "react-icons/io";
import { PiPersonSimpleThrowBold } from "react-icons/pi";
import { GrYoga } from "react-icons/gr";

// MUI Components
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from "@mui/material";

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
import { ImPower } from "react-icons/im";
import { getScoreColor } from "@/utils/getScoreColor";

/**
 * Actions component for the Players page header
 */
const PlayerActions: React.FC<{
  onAddPlayerClick: () => void;
}> = ({ onAddPlayerClick }) => (
  <button className="lumex-btn primary" onClick={onAddPlayerClick} aria-label="Add new player">
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
  const [searchFilter, setSearchFilter] = useState("");
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
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
      const _fetchedPlayers = await getPlayersByCoachId(userProfile!.id);
      setPlayers(_fetchedPlayers);
      console.log("Players fetched:", _fetchedPlayers);
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

  // Filter players based on search input
  const filteredPlayers = players.filter((player) => {
    if (!searchFilter.trim()) return true;

    const searchTerm = searchFilter.toLowerCase();
    const firstName = player.firstName?.toLowerCase() || "";
    const lastName = player.lastName?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return firstName.includes(searchTerm) || lastName.includes(searchTerm) || fullName.includes(searchTerm);
  });

  const sortedPlayers = filteredPlayers.slice().sort((a, b) => {
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

  // Sort players for cards view (always by firstName, then lastName)
  const cardSortedPlayers = filteredPlayers.slice().sort((a, b) => {
    const aFirstName = a.firstName?.toLowerCase() || "";
    const bFirstName = b.firstName?.toLowerCase() || "";

    // First compare by firstName
    if (aFirstName < bFirstName) return -1;
    if (aFirstName > bFirstName) return 1;

    // If firstName is the same, compare by lastName
    const aLastName = a.lastName?.toLowerCase() || "";
    const bLastName = b.lastName?.toLowerCase() || "";

    if (aLastName < bLastName) return -1;
    if (aLastName > bLastName) return 1;

    return 0;
  });

  // Group players by first letter of first name for cards view
  const groupedPlayers = cardSortedPlayers.reduce(
    (acc, player) => {
      const firstLetter = player.firstName?.charAt(0)?.toUpperCase() || "#";
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(player);
      return acc;
    },
    {} as Record<string, Player[]>
  );

  // Render helpers
  const PlayerCards = () => (
    <div className="players-container">
      {Object.entries(groupedPlayers)
        .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically by first letter
        .map(([firstLetter, letterPlayers]) => (
          <div key={firstLetter} className="player-letter-section">
            <h4 className="letter-title">{firstLetter}</h4>
            <div className="player-list">
              {letterPlayers.map((player) => (
                <div key={player.id} className="player-card">
                  <h5 className="card-title">{player.firstName + " " + player.lastName}</h5>
                  <p className="card-content">
                    {player.dob ? `${calculateAge(player.dob)} years old` : "Age not available"}
                  </p>
                  <div className="card-meta">
                    <div className={`meta-item ${getScoreColor(player.hittingScore)}`} title="Hitting Score">
                      <FaBaseballBatBall size={18} color="#bcbcbc" className="mb-1" />
                      {player.hittingScore ?? "--"}
                    </div>
                    <div className={`meta-item ${getScoreColor(player.throwingScore)}`} title="Throwing Score">
                      <PiPersonSimpleThrowBold size={18} color="#bcbcbc" className="mb-1" />
                      {player.throwingScore ?? "--"}
                    </div>
                    <div className={`meta-item ${getScoreColor(player.strengthScore)}`} title="Strength Score">
                      <FaDumbbell size={18} color="#bcbcbc" className="mb-1" />
                      {player.strengthScore ?? "--"}
                    </div>
                    <div className={`meta-item ${getScoreColor(player.speedScore)}`} title="Speed Score">
                      <IoMdStopwatch size={18} color="#bcbcbc" className="mb-1" />
                      {player.speedScore ?? "--"}
                    </div>
                    <div className={`meta-item ${getScoreColor(player.powerScore)}`} title="Power Score">
                      <ImPower size={18} color="#bcbcbc" className="mb-1" />
                      {player.powerScore ?? "--"}
                    </div>
                    <div className={`meta-item ${getScoreColor(player.mobilityScore)}`} title="Mobility Score">
                      <GrYoga size={18} color="#bcbcbc" className="mb-1" />
                      {player.mobilityScore ?? "--"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <TableCell>
              <TableSortLabel
                active={orderBy === "dob"}
                direction={orderBy === "dob" ? order : "asc"}
                onClick={() => handleRequestSort("dob")}
              >
                Age
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "hittingScore"}
                direction={orderBy === "hittingScore" ? order : "asc"}
                onClick={() => handleRequestSort("hittingScore")}
              >
                <FaBaseballBatBall size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "throwingScore"}
                direction={orderBy === "throwingScore" ? order : "asc"}
                onClick={() => handleRequestSort("throwingScore")}
              >
                <PiPersonSimpleThrowBold size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "strengthScore"}
                direction={orderBy === "strengthScore" ? order : "asc"}
                onClick={() => handleRequestSort("strengthScore")}
              >
                <FaDumbbell size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "speedScore"}
                direction={orderBy === "speedScore" ? order : "asc"}
                onClick={() => handleRequestSort("speedScore")}
              >
                <IoMdStopwatch size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "powerScore"}
                direction={orderBy === "powerScore" ? order : "asc"}
                onClick={() => handleRequestSort("powerScore")}
              >
                <ImPower size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "mobilityScore"}
                direction={orderBy === "mobilityScore" ? order : "asc"}
                onClick={() => handleRequestSort("mobilityScore")}
              >
                <GrYoga size={20} className="me-1 mb-1" />
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player) => (
            <TableRow key={player.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {`${player.firstName} ${player.lastName}`}
              </TableCell>
              <TableCell>{player.dob ? `${calculateAge(player.dob)}` : "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.hittingScore)}>{player.hittingScore ?? "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.throwingScore)}>{player.throwingScore ?? "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.strengthScore)}>{player.strengthScore ?? "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.speedScore)}>{player.speedScore ?? "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.powerScore)}>{player.powerScore ?? "N/A"}</TableCell>
              <TableCell className={getScoreColor(player.mobilityScore)}>{player.mobilityScore ?? "N/A"}</TableCell>
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
        actions={<PlayerActions onAddPlayerClick={handleAddPlayerClick} />}
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
              value={searchFilter}
              onChange={handleSearchChange}
            />
            <TableCardToggle view={view} setView={setView} />
          </div>

          {/* Player cards */}
          {filteredPlayers.length === 0 ? (
            <div className="content-section">
              <div className="no-players-message">
                <FaUsers className="icon" />
                <h4>{players.length === 0 ? "No players found" : "No matching players"}</h4>
                <p>
                  {players.length === 0
                    ? 'Click "Add Player" to create a new player profile.'
                    : "Try adjusting your search criteria."}
                </p>
              </div>
            </div>
          ) : (
            <>{view === "cards" ? <PlayerCards /> : <PlayerTable />}</>
          )}
        </div>
      )}

      <AddPlayerModal show={showAddPlayerModal} onClose={handleCloseModal} setPlayers={setPlayers} />
    </>
  );
});

// Add display name for debugging
PlayersPage.displayName = "PlayersPage";

export default PlayersPage;
