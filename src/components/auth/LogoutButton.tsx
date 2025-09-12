import React from "react";
import { Button } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

interface LogoutButtonProps {
  className?: string;
  size?: "sm" | "lg";
  variant?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  size = "sm",
  variant = "outline-secondary",
}) => {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={logout}
      disabled={isLoading}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      <FaSignOutAlt />
      Logout
    </Button>
  );
};

export default LogoutButton;
