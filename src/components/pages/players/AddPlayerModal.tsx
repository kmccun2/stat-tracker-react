import { useState } from "react";

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
}

/**
 * AddPlayerModal Component
 * Modal form for adding new players to the team roster
 */

const AddPlayerModal = ({ show, onClose }: AddPlayerModalProps) => {
  // Hooks
  const { userProfile } = useAuth();
  const { addPlayer } = useAPI();
  const dispatch = useAppDispatch();

  // State
  const [newPlayer, setNewPlayer] = useState<Player>({
    firstName: "",
    lastName: "",
    dob: null as Dayjs | null,
  });

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

  const updatePlayerField = <K extends keyof Player>(
    field: K,
    value: Player[K]
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

      await addPlayer({ ...newPlayer, coachId: userProfile?.id });
      showToast("success", "Player Added", "Player added successfully.");
      handleClose();
    } catch (error) {
      console.error("Error adding player:", error);
      showToast("error", "Add Player Failed", "Failed to add player.");
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{
        backgroundColor: show ? "rgba(0, 0, 0, 0.5)" : "transparent",
      }}
      tabIndex={-1}
      aria-labelledby="addPlayerModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addPlayerModalLabel">
              Add New Player
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            />
          </div>
          <div className="modal-body px-4">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newPlayer.firstName}
                  onChange={(e) =>
                    updatePlayerField("firstName", e.target.value)
                  }
                  id="firstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newPlayer.lastName}
                  onChange={(e) =>
                    updatePlayerField("lastName", e.target.value)
                  }
                  id="lastName"
                  placeholder="Enter last name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <div className="row g-2">
                  <div className="col-4">
                    <select
                      className="form-select"
                      value={newPlayer.dob ? newPlayer.dob.month() + 1 : ""}
                      onChange={(e) => updateMonth(e.target.value)}
                    >
                      <option value="">Select Month</option>
                      {MONTHS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <select
                      className="form-select"
                      value={newPlayer.dob?.date() || ""}
                      onChange={(e) => updateDay(e.target.value)}
                      disabled={!newPlayer.dob}
                    >
                      <option value="">Day</option>
                      {newPlayer.dob &&
                        Array.from(
                          {
                            length: dayjs(
                              `${newPlayer.dob.year()}-${(
                                newPlayer.dob.month() + 1
                              )
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
                    </select>
                  </div>
                  <div className="col-4">
                    <select
                      className="form-select"
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
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddNewPlayer}
              disabled={!validatePlayer()}
            >
              Add Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerModal;
