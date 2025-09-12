// React hooks for component state management
import React, { useState } from 'react';

// React Bootstrap UI components for layout and interaction
import { Badge, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

// Font Awesome React icons for visual elements
import { FaUsers, FaPlus, FaTh, FaTable } from 'react-icons/fa';

// Data context for accessing player data and operations
import { useData } from '../../../context/DataContext';

// Player-related modal components for CRUD operations
import AddPlayerModal from '../../forms/AddPlayerModal';
import EditPlayerModal from '../../forms/EditPlayerModal';

// Different view components for displaying player data
import PlayerCardView from './PlayerCardView';
import PlayerTableView from './PlayerTableView';

// Shared page header component
import PageHeader from '../../common/PageHeader';

/**
 * View mode type definition
 * Defines the available display modes for the player list
 */
type ViewMode = 'cards' | 'table';

const PlayersPage: React.FC = () => {
  const { players, addPlayer, updatePlayer, deletePlayer, apiService } = useData();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

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

  const handleViewModeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setViewMode(e.currentTarget.value as ViewMode);
  };

  return (
    <>
      <PageHeader
        title="Players"
        subtitle="Manage your team roster and track individual progress"
        icon={<FaUsers />}
        actions={
          <div className="d-flex align-items-center gap-3">
            <Badge bg="primary" pill className="fs-6">
              {players.length} {players.length === 1 ? 'Player' : 'Players'}
            </Badge>

            {/* View Toggle */}
            <ButtonGroup className="view-toggle-group">
              <ToggleButton
                id="card-view"
                type="radio"
                variant={viewMode === 'cards' ? 'primary' : 'outline-primary'}
                name="viewMode"
                value="cards"
                checked={viewMode === 'cards'}
                onChange={handleViewModeChange}
                className="d-flex align-items-center gap-1"
              >
                <FaTh />
                Cards
              </ToggleButton>
              <ToggleButton
                id="table-view"
                type="radio"
                variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                name="viewMode"
                value="table"
                checked={viewMode === 'table'}
                onChange={handleViewModeChange}
                className="d-flex align-items-center gap-1"
              >
                <FaTable />
                Table
              </ToggleButton>
            </ButtonGroup>

            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <FaPlus />
              Add Player
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="page-main-content">
        {/* Conditional rendering based on view mode */}
        {viewMode === 'cards' ? (
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
          <div>
            <div className="alert alert-warning text-center" role="alert">
              <h4 className="alert-heading">No Players Found</h4>
              <p className="mb-0">Start by adding your first player.</p>
            </div>
          </div>
        )}
      </div>

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
    </>
  );
};

export default PlayersPage;
