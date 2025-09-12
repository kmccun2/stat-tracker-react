import "./AppLayout.scss";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaChartLine,
  FaBullseye,
  FaCog,
  FaBars,
  FaBaseballBall,
  FaRuler,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import UserProfile from "../components/auth/UserProfile";
import LoginButton from "../components/auth/LoginButton";
import { ReactNode, useState, useEffect } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  path: string;
  label: string;
  icon: ReactNode;
  description: string;
  comingSoon?: boolean;
}

interface SidebarContentProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleCloseSidebar = (): void => setShowSidebar(false);
  const handleShowSidebar = (): void => setShowSidebar(true);
  const handleSidebarMouseEnter = (): void => setIsSidebarHovered(true);
  const handleSidebarMouseLeave = (): void => setIsSidebarHovered(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  const sidebarItems: SidebarItem[] = [
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
      comingSoon: true,
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
      path: "/goals",
      label: "Goals",
      icon: <FaBullseye />,
      description: "Manage assessment goals",
      comingSoon: true,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
      description: "App configuration",
      comingSoon: true,
    },
  ];

  const SidebarContent: React.FC<SidebarContentProps> = ({
    isMobile = false,
    onItemClick,
  }) => (
    <div className="sidebar-content h-100">
      <Nav
        className="flex-column"
        style={{ padding: isMobile ? "10px 0" : "0" }}
      >
        {sidebarItems.map((item) => (
          <Nav.Item key={item.path} className="mb-2">
            <Nav.Link
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${
                location.pathname === item.path ? "active" : ""
              } ${item.comingSoon ? "coming-soon" : ""}`}
              onClick={onItemClick}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <div className="sidebar-text">
                <div className="d-flex align-items-center gap-2">
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span
                      className="badge bg-warning text-dark"
                      style={{ fontSize: "0.6rem" }}
                    >
                      Soon
                    </span>
                  )}
                </div>
                <small className="text-muted">{item.description}</small>
              </div>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );

  return (
    <div className="app-layout">
      {/* Header */}
      <Navbar bg="primary" variant="dark" className="navbar-custom shadow-sm">
        <Container fluid>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              className="d-lg-none me-3"
              onClick={handleShowSidebar}
            >
              <FaBars />
            </Button>
            <Navbar.Brand className="mb-0 d-flex align-items-center gap-2">
              <FaBaseballBall />
              Baseball Stat Tracker
            </Navbar.Brand>
          </div>

          <Nav className="ms-auto d-flex align-items-center">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <LoginButton variant="outline-light" />
            )}
          </Nav>
        </Container>
      </Navbar>

      <div className="app-body">
        <Container fluid className="h-100">
          <Row className="h-100">
            {/* Desktop Sidebar */}
            <Col lg={3} xl={2} className="d-none d-lg-block sidebar-col">
              <div
                className="sidebar-desktop"
                onMouseEnter={handleSidebarMouseEnter}
                onMouseLeave={handleSidebarMouseLeave}
              >
                <SidebarContent />
              </div>
            </Col>

            {/* Main Content */}
            <Col lg={9} xl={10} className="main-content-col">
              <div className="main-content">{children}</div>
            </Col>
          </Row>
        </Container>

        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={handleCloseSidebar}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <SidebarContent isMobile={true} onItemClick={handleCloseSidebar} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default AppLayout;
