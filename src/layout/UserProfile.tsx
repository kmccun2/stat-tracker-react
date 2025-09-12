import React from "react";
import { Dropdown, Badge, Spinner } from "react-bootstrap";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user, userProfile, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span className="small">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName =
    userProfile?.firstName || user?.given_name || user?.name || "Coach";
  const displayEmail = user?.email;
  const profilePicture = user?.picture;

  return (
    <Dropdown align="end" className="me-2">
      <Dropdown.Toggle
        variant="link"
        className="d-flex align-items-center gap-2 text-decoration-none p-0 border-0"
        style={{ boxShadow: "none" }}
      >
        <div className="d-none d-md-block text-end">
          <div className="small fw-bold text-light">{displayName}</div>
          <div className="text-light" style={{ fontSize: "0.75rem" }}>
            Coach
          </div>
        </div>
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="rounded-circle"
            width="32"
            height="32"
          />
        ) : (
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
            style={{ width: "32px", height: "32px" }}
          >
            <FaUser />
          </div>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>
          <div className="fw-bold">{displayName}</div>
          <div className="text-light small">{displayEmail}</div>
        </Dropdown.Header>

        <Dropdown.Divider />

        <Dropdown.Item
          as={Link}
          to="/settings"
          className="d-flex align-items-center gap-2"
        >
          <FaCog />
          Settings
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          onClick={logout}
          className="d-flex align-items-center gap-2 text-danger"
        >
          <FaSignOutAlt />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfile;
