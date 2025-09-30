import { useEffect, useState } from "react";

// React Bootstrap components
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";

// Date utilities
import dayjs, { Dayjs } from "dayjs";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAuth } from "../../../context/AuthContext";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Player, PlayerProfile } from "@/types/player";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";

// Constants
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = 100;

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

// Types
interface AddOrEditPlayerModalProps {
  player?: PlayerProfile;
  show: boolean;
  onClose: () => void;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerProfile | undefined>>;
  setPlayers?: React.Dispatch<React.SetStateAction<Player[]>>;
}

interface PlayerFormData {
  firstName: string;
  lastName: string;
  dob: Dayjs | null;
}

/**
 * AddPlayerModal Component
 * Modal form for adding new players to the team roster
 */

const AddOrEditPlayerModal = ({ player, show, onClose, setPlayer, setPlayers }: AddOrEditPlayerModalProps) => {
  // Hooks
  const { userProfile } = useAuth();
  const { addPlayer, updatePlayerById } = useAPI();
  const dispatch = useAppDispatch();

  // State
  const [playerForm, setPlayerForm] = useState<PlayerFormData>({
    firstName: "",
    lastName: "",
    dob: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  const resetForm = () => {
    setPlayerForm({
      firstName: "",
      lastName: "",
      dob: null,
    });
  };

  const validatePlayer = (): boolean => {
    return !!(playerForm.firstName && playerForm.lastName && playerForm.dob);
  };

  const showToast = (type: "success" | "error", title: string, message: string) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title,
        message,
        type,
      } as ToastItemType)
    );
  };

  const updatePlayerField = <K extends keyof PlayerFormData>(field: K, value: PlayerFormData[K]) => {
    setPlayerForm((prev) => ({ ...prev, [field]: value }));
  };

  // Date handling functions
  const updateMonth = (monthValue: string) => {
    const month = monthValue ? parseInt(monthValue) : null;
    if (month) {
      const currentYear = playerForm.dob?.year() || CURRENT_YEAR;
      const currentDay = Math.min(
        playerForm.dob?.date() || 1,
        dayjs(`${currentYear}-${month.toString().padStart(2, "0")}-01`).daysInMonth()
      );
      updatePlayerField(
        "dob",
        dayjs(`${currentYear}-${month.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`)
      );
    } else {
      updatePlayerField("dob", null);
    }
  };

  const updateDay = (dayValue: string) => {
    const day = dayValue ? parseInt(dayValue) : null;
    if (day && playerForm.dob) {
      const currentYear = playerForm.dob.year();
      const currentMonth = playerForm.dob.month() + 1;
      updatePlayerField(
        "dob",
        dayjs(`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`)
      );
    }
  };

  const updateYear = (yearValue: string) => {
    const year = yearValue ? parseInt(yearValue) : null;
    if (year) {
      const currentMonth = playerForm.dob ? playerForm.dob.month() + 1 : 1;
      const currentDay = Math.min(
        playerForm.dob?.date() || 1,
        dayjs(`${year}-${currentMonth.toString().padStart(2, "0")}-01`).daysInMonth()
      );
      updatePlayerField(
        "dob",
        dayjs(`${year}-${currentMonth.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`)
      );
    } else {
      updatePlayerField("dob", null);
    }
  };

  // Event handlers
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAction = async () => {
    try {
      if (!validatePlayer()) {
        showToast("error", "Validation Error", "Please fill in all fields.");
        return;
      }

      if (!userProfile?.id) {
        showToast("error", "Authentication Error", "User profile not found.");
        return;
      }

      setIsLoading(true);

      // Convert form data to Player object
      const playerData: Omit<Player, "id"> = {
        firstName: playerForm.firstName,
        lastName: playerForm.lastName,
        dob: playerForm.dob!, // We know this is not null due to validation
        coachId: userProfile.id,
      };

      // Edit player
      if (player && setPlayer) {
        let _player: Player = await updatePlayerById(player.id!, playerData);
        showToast("success", "Player Updated", "Player updated successfully.");
        setPlayer({
          ...player,
          firstName: playerForm.firstName,
          lastName: playerForm.lastName,
          dob: playerForm.dob!,
        } as PlayerProfile);
      }

      // Add player
      if (setPlayers) {
        let _player: Player = await addPlayer(playerData);
        showToast("success", "Player Added", "Player added successfully.");
        setPlayers((prev) => [...prev, _player]);
      }

      // Close modal and reset form
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Error adding player:", error);
      showToast("error", "Add Player Failed", "Failed to add player.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hooks
  useEffect(() => {
    if (player) {
      setPlayerForm({
        firstName: player.firstName,
        lastName: player.lastName,
        dob: player.dob ? dayjs(player.dob) : null,
      });
    }
  }, [player]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{player ? "Edit Player" : "Add New Player"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Form.Control
              type="text"
              value={playerForm.firstName}
              onChange={(e) => updatePlayerField("firstName", e.target.value)}
              id="firstName"
              placeholder="Enter first name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <Form.Control
              type="text"
              value={playerForm.lastName}
              onChange={(e) => updatePlayerField("lastName", e.target.value)}
              id="lastName"
              placeholder="Enter last name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Row className="g-2">
              <Col xs={4}>
                <Form.Select
                  value={playerForm.dob ? playerForm.dob.month() + 1 : ""}
                  onChange={(e) => updateMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {MONTHS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={4}>
                <Form.Select
                  value={playerForm.dob?.date() || ""}
                  onChange={(e) => updateDay(e.target.value)}
                  disabled={!playerForm.dob}
                >
                  <option value="">Day</option>
                  {playerForm.dob &&
                    Array.from(
                      {
                        length: dayjs(
                          `${playerForm.dob.year()}-${(playerForm.dob.month() + 1).toString().padStart(2, "0")}-01`
                        ).daysInMonth(),
                      },
                      (_, i) => i + 1
                    ).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col xs={4}>
                <Form.Select value={playerForm.dob?.year() || ""} onChange={(e) => updateYear(e.target.value)}>
                  <option value="">Year</option>
                  {Array.from({ length: YEAR_RANGE }, (_, i) => CURRENT_YEAR - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => handleAction()} disabled={!validatePlayer() || isLoading}>
          {isLoading && (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
          )}
          {isLoading ? `${player ? "Saving..." : "Adding..."}` : `${player ? "Save" : "Add Player"}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddOrEditPlayerModal;
