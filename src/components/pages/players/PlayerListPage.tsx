import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useData } from "../../../context/DataContext";
import AddPlayerModal from "./AddPlayerModal";
import EditPlayerModal from "./EditPlayerModal";
import PlayerCardView from "./PlayerCardView";
import PlayerTableView from "./PlayerTableView";

type ViewMode = "cards" | "table";

const PlayerListPage: React.FC = () => {
  const { players, addPlayer, updatePlayer, deletePlayer, apiService } =
    useData();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const handlePlayerAdded = (newPlayer: any): void => {
    addPlayer(newPlayer);
  };

  const handlePlayerUpdated = (updatedPlayer: any): void => {
    updatePlayer(updatedPlayer);
  };

  const handlePlayerDeleted = (playerId: number): void => {
    deletePlayer(playerId);
  };

  const handleEditPlayer = (player: any): void => {
    setSelectedPlayer(player);
    setShowEditModal(true);
  };

  const handleViewModeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setViewMode(e.currentTarget.value as ViewMode);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Players</h2>
              <p className="text-muted mb-0">
                Manage your team roster and track individual progress
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg="primary" pill className="fs-6">
                {players.length} {players.length === 1 ? "Player" : "Players"}
              </Badge>

              {/* View Toggle */}
              <ButtonGroup className="view-toggle-group">
                <ToggleButton
                  id="card-view"
                  type="radio"
                  variant={viewMode === "cards" ? "primary" : "outline-primary"}
                  name="viewMode"
                  value="cards"
                  checked={viewMode === "cards"}
                  onChange={handleViewModeChange}
                  className="d-flex align-items-center gap-1"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                  </svg>
                  Cards
                </ToggleButton>
                <ToggleButton
                  id="table-view"
                  type="radio"
                  variant={viewMode === "table" ? "primary" : "outline-primary"}
                  name="viewMode"
                  value="table"
                  checked={viewMode === "table"}
                  onChange={handleViewModeChange}
                  className="d-flex align-items-center gap-1"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                  </svg>
                  Table
                </ToggleButton>
              </ButtonGroup>

              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>+</span>
                Add Player
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Conditional rendering based on view mode */}
      {viewMode === "cards" ? (
        <PlayerCardView
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handlePlayerDeleted}
          apiService={apiService}
        />
      ) : (
        <PlayerTableView
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handlePlayerDeleted}
          apiService={apiService}
        />
      )}

      {players.length === 0 && (
        <Row>
          <Col>
            <div className="alert alert-warning text-center" role="alert">
              <h4 className="alert-heading">No Players Found</h4>
              <p className="mb-0">Start by adding your first player.</p>
            </div>
          </Col>
        </Row>
      )}

      <AddPlayerModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onPlayerAdded={handlePlayerAdded}
        apiService={apiService}
      />

      <EditPlayerModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onPlayerUpdated={handlePlayerUpdated}
        player={selectedPlayer}
        apiService={apiService}
      />
    </Container>
  );
};

export default PlayerListPage;
