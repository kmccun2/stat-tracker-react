import React, { useState } from "react";
import { Dropdown, Modal, Button, Alert } from "react-bootstrap";

// Type definitions
interface Player {
  id: number;
  name?: string;
  Name?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface ApiService {
  deletePlayer: (id: number) => Promise<ApiResponse>;
}

interface PlayerActionsDropdownProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: number) => void;
  apiService: ApiService;
}

const PlayerActionsDropdown: React.FC<PlayerActionsDropdownProps> = ({
  player,
  onEdit,
  onDelete,
  apiService,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const handleEditClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(player);
  };

  const handleDeleteClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      if (apiService) {
        // Delete from backend API
        const response = await apiService.deletePlayer(player.id);
        if (!response.success) {
          throw new Error(response.message || "Failed to delete player");
        }
      }

      // Call the callback to update the parent component
      onDelete(player.id);
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error("Error deleting player:", error);
      setDeleteError(
        error.message || "Failed to delete player. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false);
    setDeleteError("");
  };

  return (
    <>
      <Dropdown
        onClick={(e) => e.stopPropagation()}
        className="position-absolute top-0 end-0 mt-2 me-2"
      >
        <Dropdown.Toggle
          variant="link"
          className="p-1 text-muted border-0 bg-transparent shadow-none"
          style={{ fontSize: "1.2em" }}
        >
          ⚙️
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <Dropdown.Item
            onClick={handleEditClick}
            className="d-flex align-items-center gap-2"
          >
            <span>✏️</span>
            Edit Player
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={handleDeleteClick}
            className="d-flex align-items-center gap-2 text-danger"
          >
            <span>🗑️</span>
            Delete Player
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" className="mb-3">
              {deleteError}
            </Alert>
          )}
          <p>
            Are you sure you want to delete{" "}
            <strong>{player.Name || player.name}</strong>?
          </p>
          <p className="text-muted small">
            This action cannot be undone. All assessment data for this player
            will also be deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Player"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlayerActionsDropdown;
