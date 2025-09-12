import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

interface LoginButtonProps {
  className?: string;
  size?: "sm" | "lg";
  variant?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  className = "",
  size = "sm",
  variant = "primary",
}) => {
  const { login, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={login}
      disabled={isLoading}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <Spinner animation="border" size="sm" />
          Loading...
        </>
      ) : (
        <>
          <FaSignInAlt />
          Login / Sign Up
        </>
      )}
    </Button>
  );
};

export default LoginButton;
