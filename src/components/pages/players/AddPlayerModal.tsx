import { useState } from "react";

// React Bootstrap components
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";

// Date utilities
import dayjs, { Dayjs } from "dayjs";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAuth } from "../../../context/AuthContext";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Player } from "@/types/player";
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
interface AddPlayerModalProps {
  show: boolean;
  onClose: () => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
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

const AddPlayerModal = ({ show, onClose, setPlayers }: AddPlayerModalProps) => {
  // Hooks
  const { userProfile } = useAuth();
  const { addPlayer } = useAPI();
  const dispatch = useAppDispatch();

  // State
  const [newPlayer, setNewPlayer] = useState<PlayerFormData>({
    firstName: "",
    lastName: "",
    dob: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  const resetForm = () => {
    setNewPlayer({
      firstName: "",
      lastName: "",
      dob: null,
    });
  };

  const validatePlayer = (): boolean => {
    return !!(newPlayer.firstName && newPlayer.lastName && newPlayer.dob);
  };

  const showToast = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title,
        message,
        type,
      } as ToastItemType)
    );
  };

  const updatePlayerField = <K extends keyof PlayerFormData>(
    field: K,
    value: PlayerFormData[K]
  ) => {
    setNewPlayer((prev) => ({ ...prev, [field]: value }));
  };

  // Date handling functions
  const updateMonth = (monthValue: string) => {
    const month = monthValue ? parseInt(monthValue) : null;
    if (month) {
      const currentYear = newPlayer.dob?.year() || CURRENT_YEAR;
      const currentDay = Math.min(
        newPlayer.dob?.date() || 1,
        dayjs(
          `${currentYear}-${month.toString().padStart(2, "0")}-01`
        ).daysInMonth()
      );
      updatePlayerField(
        "dob",
        dayjs(
          `${currentYear}-${month.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`
        )
      );
    } else {
      updatePlayerField("dob", null);
    }
  };

  const updateDay = (dayValue: string) => {
    const day = dayValue ? parseInt(dayValue) : null;
    if (day && newPlayer.dob) {
      const currentYear = newPlayer.dob.year();
      const currentMonth = newPlayer.dob.month() + 1;
      updatePlayerField(
        "dob",
        dayjs(
          `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
        )
      );
    }
  };

  const updateYear = (yearValue: string) => {
    const year = yearValue ? parseInt(yearValue) : null;
    if (year) {
      const currentMonth = newPlayer.dob ? newPlayer.dob.month() + 1 : 1;
      const currentDay = Math.min(
        newPlayer.dob?.date() || 1,
        dayjs(
          `${year}-${currentMonth.toString().padStart(2, "0")}-01`
        ).daysInMonth()
      );
      updatePlayerField(
        "dob",
        dayjs(
          `${year}-${currentMonth.toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`
        )
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

  const handleAddNewPlayer = async () => {
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
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        dob: newPlayer.dob!, // We know this is not null due to validation
        coachId: userProfile.id,
      };

      let _player: Player = await addPlayer(playerData);
      showToast("success", "Player Added", "Player added successfully.");

      setPlayers((prev) => [...prev, _player]);
      handleClose();
    } catch (error) {
      console.error("Error adding player:", error);
      showToast("error", "Add Player Failed", "Failed to add player.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Player</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Form.Control
              type="text"
              value={newPlayer.firstName}
              onChange={(e) => updatePlayerField("firstName", e.target.value)}
              id="firstName"
              placeholder="Enter first name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <Form.Control
              type="text"
              value={newPlayer.lastName}
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
                  value={newPlayer.dob ? newPlayer.dob.month() + 1 : ""}
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
                  value={newPlayer.dob?.date() || ""}
                  onChange={(e) => updateDay(e.target.value)}
                  disabled={!newPlayer.dob}
                >
                  <option value="">Day</option>
                  {newPlayer.dob &&
                    Array.from(
                      {
                        length: dayjs(
                          `${newPlayer.dob.year()}-${(newPlayer.dob.month() + 1)
                            .toString()
                            .padStart(2, "0")}-01`
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
                <Form.Select
                  value={newPlayer.dob?.year() || ""}
                  onChange={(e) => updateYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: YEAR_RANGE },
                    (_, i) => CURRENT_YEAR - i
                  ).map((year) => (
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
        <Button
          variant="primary"
          onClick={handleAddNewPlayer}
          disabled={!validatePlayer() || isLoading}
        >
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
          )}
          {isLoading ? "Adding..." : "Add Player"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPlayerModal;
