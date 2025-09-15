import { ReactNode, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import {
  FaUsers,
  FaChartLine,
  FaCog,
  FaBars,
  FaRuler,
  FaTachometerAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import LoginButton from "../components/auth/LoginButton";
import Toast from "@/components/common/toast/Toast";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";
import "./AppLayout.scss";

interface AppLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  path: string;
  label: string;
  icon: ReactNode;
  description: string;
}

interface SidebarContentProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState<boolean>(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated, userProfile } = useAuth();

  const handleCloseMobileSidebar = (): void => setShowMobileSidebar(false);
  const handleShowMobileSidebar = (): void => setShowMobileSidebar(true);
  const handleToggleDesktopSidebar = (): void =>
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  const handleSidebarMouseEnter = (): void => setIsSidebarHovered(true);
  const handleSidebarMouseLeave = (): void => setIsSidebarHovered(false);

  useEffect(() => {
    setShowMobileSidebar(false);
  }, [location.pathname]);

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
        description: "Assessment overview",
      },
      {
        path: "/analytics",
        label: "Analytics",
        icon: <FaChartLine />,
        description: "View progress reports",
      },
      {
        path: "/players",
        label: "Players",
        icon: <FaUsers />,
        description: "Manage player profiles",
      },
      {
        path: "/metrics",
        label: "Metrics",
        icon: <FaRuler />,
        description: "Manage assessment metrics",
      },
      {
        path: "/settings",
        label: "Settings",
        icon: <FaCog />,
        description: "App configuration",
      },
    ],
    []
  );

  const SidebarContent: React.FC<SidebarContentProps> = ({
    isMobile = false,
    isCollapsed = false,
    onItemClick,
  }) => (
    <div className={`sidebar-content h-100 ${isCollapsed ? "collapsed" : ""}`}>
      <Nav
        className="flex-column"
        style={{ padding: isMobile ? "10px 0" : "0" }}
      >
        {sidebarItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${
                location.pathname === item.path ? "active" : ""
              } ${isCollapsed ? "collapsed" : ""}`}
              onClick={onItemClick}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <div className="sidebar-text">
                  <div className="d-flex align-items-center">
                    <span>{item.label}</span>
                  </div>
                </div>
              )}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );

  return (
    <div className="app-layout">
      <Navbar bg="primary" variant="dark" className="navbar-custom">
        <div className="d-flex align-items-center">
          <div
            className="d-lg-none hamburger-icon"
            onClick={handleShowMobileSidebar}
          >
            <FaBars />
          </div>
          <div
            className="d-none d-lg-flex hamburger-icon"
            onClick={handleToggleDesktopSidebar}
            title={isDesktopSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            <FaBars />
          </div>
          <div className="logo">
            Clip<div>bordz</div>
          </div>
        </div>

        <Nav className="ms-auto d-flex align-items-center">
          {isAuthenticated && userProfile && userProfile.id ? (
            <UserProfile />
          ) : (
            <LoginButton variant="outline-light" />
          )}
        </Nav>
      </Navbar>

      <div className="app-body">
        <div className="d-flex w-100">
          <div
            className={`d-none d-lg-flex sidebar-desktop ${
              isDesktopSidebarCollapsed ? "collapsed" : ""
            } ${isDesktopSidebarCollapsed && isSidebarHovered ? "hovered" : ""}`}
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
          >
            <SidebarContent
              isCollapsed={isDesktopSidebarCollapsed && !isSidebarHovered}
            />
          </div>

          {isAuthenticated ? (
            <div className="main-content">{children}</div>
          ) : (
            <div className="w-100 h-100">
              <LumexSpinner />
            </div>
          )}
        </div>

        <Offcanvas
          show={showMobileSidebar}
          onHide={handleCloseMobileSidebar}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <SidebarContent
              isMobile={true}
              onItemClick={handleCloseMobileSidebar}
            />
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <Toast />
    </div>
  );
};

export default AppLayout;
