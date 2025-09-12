// Component-specific styling
import './AppLayout.scss';

// React Bootstrap UI components for layout and navigation
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';

// React Router for navigation and location tracking
import { Link, useLocation } from 'react-router-dom';

// Font Awesome React icons for navigation and visual elements
import {
  FaUsers,
  FaChartLine,
  FaBullseye,
  FaCog,
  FaBars,
  FaRuler,
  FaTachometerAlt,
} from 'react-icons/fa';

// React hooks for component logic
import { ReactNode, useState, useEffect } from 'react';

// Authentication context and components
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import LoginButton from '../components/auth/LoginButton';

/**
 * Props interface for the main application layout
 */
interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Navigation sidebar item interface
 * Defines structure for navigation menu items
 */
interface SidebarItem {
  path: string;
  label: string;
  icon: ReactNode;
  description: string;
}

/**
 * Props interface for sidebar content component
 */
interface SidebarContentProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false); // For mobile
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(false); // For desktop
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleCloseMobileSidebar = (): void => setShowMobileSidebar(false);
  const handleShowMobileSidebar = (): void => setShowMobileSidebar(true);
  const handleToggleDesktopSidebar = (): void =>
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  const handleSidebarMouseEnter = (): void => setIsSidebarHovered(true);
  const handleSidebarMouseLeave = (): void => setIsSidebarHovered(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setShowMobileSidebar(false);
  }, [location.pathname]);

  const sidebarItems: SidebarItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <FaTachometerAlt />,
      description: 'Assessment overview',
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: <FaChartLine />,
      description: 'View progress reports',
    },
    {
      path: '/players',
      label: 'Players',
      icon: <FaUsers />,
      description: 'Manage player profiles',
    },
    {
      path: '/metrics',
      label: 'Metrics',
      icon: <FaRuler />,
      description: 'Manage assessment metrics',
    },
    {
      path: '/goals',
      label: 'Goals',
      icon: <FaBullseye />,
      description: 'Manage assessment goals',
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FaCog />,
      description: 'App configuration',
    },
  ];

  const SidebarContent: React.FC<SidebarContentProps> = ({
    isMobile = false,
    isCollapsed = false,
    onItemClick,
  }) => (
    <div className={`sidebar-content h-100 ${isCollapsed ? 'collapsed' : ''}`}>
      <Nav className="flex-column" style={{ padding: isMobile ? '10px 0' : '0' }}>
        {sidebarItems.map(item => (
          <Nav.Item key={item.path}>
            <Nav.Link
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${
                location.pathname === item.path ? 'active' : ''
              } ${isCollapsed ? 'collapsed' : ''}`}
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
      {/* Header */}
      <Navbar bg="primary" variant="dark" className="navbar-custom">
        <div className="d-flex align-items-center">
          {/* Mobile toggle button */}
          <div className="d-lg-none hamburger-icon" onClick={handleShowMobileSidebar}>
            <FaBars />
          </div>
          {/* Desktop toggle button */}
          <div
            className="d-none d-lg-flex hamburger-icon"
            onClick={handleToggleDesktopSidebar}
            title={isDesktopSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          >
            <FaBars />
          </div>
          <div className="logo">
            Clip<div>bordz</div>
          </div>
        </div>

        <Nav className="ms-auto d-flex align-items-center">
          {isAuthenticated ? <UserProfile /> : <LoginButton variant="outline-light" />}
        </Nav>
      </Navbar>

      <div className="app-body">
        <div className="d-flex w-100">
          {/* Desktop Sidebar */}
          <div
            className={`d-none d-lg-flex sidebar-desktop ${
              isDesktopSidebarCollapsed ? 'collapsed' : ''
            } ${isDesktopSidebarCollapsed && isSidebarHovered ? 'hovered' : ''}`}
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
          >
            <SidebarContent isCollapsed={isDesktopSidebarCollapsed && !isSidebarHovered} />
          </div>

          {/* Main Content */}
          <div className="main-content">{children}</div>
        </div>

        {/* Mobile Sidebar */}
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
            <SidebarContent isMobile={true} onItemClick={handleCloseMobileSidebar} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default AppLayout;
