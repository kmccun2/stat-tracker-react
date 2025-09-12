import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

// Type definitions
interface FormData {
  name: string;
  gender: string;
  dob: string;
}

interface Player {
  id?: number;
  name?: string;
  Name?: string;
  gender?: string;
  Gender?: string;
  dob?: number;
  DOB?: number;
  age?: number;
  ageRange?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Player;
  message?: string;
}

interface ApiService {
  updatePlayer: (id: number | undefined, data: any) => Promise<ApiResponse>;
}

interface EditPlayerModalProps {
  show: boolean;
  onHide: () => void;
  onPlayerUpdated: (player: Player) => void;
  player: Player | null;
  apiService: ApiService;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  show,
  onHide,
  onPlayerUpdated,
  player,
  apiService,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    dob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Initialize form data when player prop changes
  useEffect(() => {
    if (player) {
      setFormData({
        name: player.Name || player.name || "",
        gender: player.Gender || player.gender || "",
        dob: convertExcelSerialToDate(player.DOB || player.dob || 0),
      });
    }
  }, [player]);

  const convertExcelSerialToDate = (serial: number): string => {
    if (!serial) return "";
    // Convert Excel serial number to YYYY-MM-DD format
    const excelEpoch = new Date(1900, 0, 1);
    const days = serial - 2; // Excel incorrectly treats 1900 as a leap year
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  };

  const convertDateToExcelSerial = (dateString: string): number => {
    // Convert YYYY-MM-DD to Excel serial number
    const date = new Date(dateString);
    const excelEpoch = new Date(1900, 0, 1);
    const diffTime = date.getTime() - excelEpoch.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 2; // Excel incorrectly treats 1900 as a leap year
  };

  const calculateAge = (dateString: string): number => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getAgeRange = (age: number): string => {
    if (age <= 12) return "12 or less";
    if (age >= 13 && age <= 14) return "13-14";
    if (age >= 15 && age <= 16) return "15-16";
    if (age >= 17 && age <= 18) return "17-18";
    return "18+";
  };

  const handleInputChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }

    if (!formData.dob) {
      setError("Date of birth is required");
      return false;
    }

    const birthDate = new Date(formData.dob);
    const today = new Date();
    if (birthDate > today) {
      setError("Date of birth cannot be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let updatedPlayer: Player;

      if (apiService) {
        // Submit to backend API
        const dobSerial = convertDateToExcelSerial(formData.dob);
        const response = await apiService.updatePlayer(player?.id, {
          name: formData.name.trim(),
          gender: formData.gender,
          dob: dobSerial,
        });

        if (response.success && response.data) {
          updatedPlayer = {
            ...response.data,
            Name: response.data.name, // API format conversion
            Gender: response.data.gender,
            DOB: response.data.dob,
            age: calculateAge(formData.dob),
            ageRange: getAgeRange(calculateAge(formData.dob)),
          };
          setSuccess("Player updated successfully!");
        } else {
          throw new Error(response.message || "Failed to update player");
        }
      } else {
        // Fallback if no API service
        updatedPlayer = {
          ...player,
          name: formData.name.trim(),
          Name: formData.name.trim(),
          gender: formData.gender,
          Gender: formData.gender,
          age: calculateAge(formData.dob),
          ageRange: getAgeRange(calculateAge(formData.dob)),
        };
      }

      // Call the callback to update the parent component
      onPlayerUpdated(updatedPlayer);

      // Close modal after successful submission
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 1500);
    } catch (error: any) {
      console.error("Error updating player:", error);
      setError(error.message || "Failed to update player. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    setError("");
    setSuccess("");
    onHide();
  };

  if (!player) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Player</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter player's full name"
              disabled={isSubmitting}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender *</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth *</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
            <Form.Text className="text-muted">
              This will be used to calculate age and determine appropriate
              goals.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Updating Player...
              </>
            ) : (
              "Update Player"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPlayerModal;
