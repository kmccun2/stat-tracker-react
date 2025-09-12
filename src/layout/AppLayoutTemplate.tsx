// Styles
import "./AppLayoutTemplate.scss";

// Hooks
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Components
import type { ReactNode } from "react";
import LumexToast from "../common/components/toast/LumexToast";

// Router
import { Link, redirect, useLocation } from "react-router-dom";

// Icons
import { HiBars3 } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import {
  HiUserGroup,
  HiChartBar,
  HiCog6Tooth,
  HiQuestionMarkCircle,
} from "react-icons/hi2";
import { BsClipboard2DataFill } from "react-icons/bs";
import { LiaBroomSolid } from "react-icons/lia";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaBaseballBatBall } from "react-icons/fa6";
import { PiBaseballCapBold } from "react-icons/pi";
import { useAppSelector } from "../common/hooks/redux";
import { MdDashboard } from "react-icons/md";

interface LayoutProps {
  children: ReactNode;
}

const AppLayoutTemplate = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuth0();
  const location = useLocation();

  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Global state
  const error = useAppSelector((state) => state.global.error);

  // Hook to expand submenus
  // useEffect(() => {
  //   if (location.pathname.startsWith("/teams")) {
  //     setIsTeamsExpanded(true);
  //   }
  // }, [location.pathname]);

  // Event handlers
  const handleMenuClick = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSidebarMouseEnter = () => setIsSidebarHovered(true);
  const handleSidebarMouseLeave = () => setIsSidebarHovered(false);

  // Utils
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    {
      path: "/scouting-report",
      label: "Scouting Report",
      icon: BsClipboard2DataFill,
    },
    { path: "/teams", label: "Teams", icon: HiUserGroup },
    { path: "/players", label: "Players", icon: PiBaseballCapBold },
    { path: "/game-reviews", label: "Game Reviews", icon: FaBaseballBatBall },
    { path: "/visuals", label: "Visuals", icon: HiChartBar },
    { path: "/data-cleaning", label: "Data Cleaning", icon: LiaBroomSolid },
    { path: "/settings", label: "Settings", icon: HiCog6Tooth },
    {
      path: "/metrics-glossary",
      label: "Metrics Glossary",
      icon: IoMdInformationCircleOutline,
    },
    { path: "/faqs", label: "FAQs", icon: HiQuestionMarkCircle },
  ];

  const sidebarWidth = isAuthenticated
    ? isSidebarOpen || isSidebarHovered
      ? 250
      : 60
    : 0;

  // If global error exists, redirect to error page
  useEffect(() => {
    if (error) {
      redirect("/error");
    }
  }, [error]);

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div
            className="menu-button"
            onClick={handleMenuClick}
            aria-label="Toggle sidebar"
          >
            <HiBars3 size="30px" />
          </div>
          <h1 className="app-title">Diamond Stats</h1>
        </div>

        <div className="header-right">
          {isAuthenticated && (
            <div
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
              className="logout-button"
              title="Log Out"
            >
              <BiLogOut size={24} />
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      {isAuthenticated && (
        <aside
          className={`sidebar ${
            isSidebarOpen || isSidebarHovered
              ? "sidebar--open"
              : "sidebar--closed"
          }`}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      isActive(item.path) ? "nav-link--active" : ""
                    }`}
                  >
                    <span className="nav-icon">
                      <item.icon size="1.5rem" />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`main-content ${
          isAuthenticated ? "main-content--with-sidebar" : ""
        }`}
        style={{
          marginLeft: isAuthenticated ? `${sidebarWidth}px` : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </main>

      {/* Toast Container */}
      <LumexToast />
    </div>
  );
};

export default AppLayoutTemplate;
