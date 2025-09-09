import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaChartLine, 
  FaBullseye, 
  FaCog, 
  FaBars,
  FaBaseballBall
} from 'react-icons/fa';

const AppLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const sidebarItems = [
    { 
      path: '/', 
      label: 'Players', 
      icon: <FaUsers />,
      description: 'Manage player profiles'
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <FaChartLine />,
      description: 'View progress reports',
      comingSoon: true
    },
    { 
      path: '/goals', 
      label: 'Goals', 
      icon: <FaBullseye />,
      description: 'Manage assessment goals',
      comingSoon: true
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <FaCog />,
      description: 'App configuration',
      comingSoon: true
    }
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="sidebar-content h-100">
      <div className="sidebar-header p-3 border-bottom">
        <h5 className="mb-0 text-primary d-flex align-items-center gap-2">
          <FaBaseballBall />
          Stat Tracker
        </h5>
        <small className="text-muted">Player Development</small>
      </div>
      
      <Nav className="flex-column p-3">
        {sidebarItems.map((item) => (
          <Nav.Item key={item.path} className="mb-2">
            <Nav.Link
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${location.pathname === item.path ? 'active' : ''} ${item.comingSoon ? 'coming-soon' : ''}`}
              onClick={isMobile ? handleCloseSidebar : undefined}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <div className="sidebar-text">
                <div className="d-flex align-items-center gap-2">
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem' }}>
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
          
          <Nav className="ms-auto">
            <Nav.Link href="#" className="text-light">
              <small>Coach Dashboard</small>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="app-body">
        <Container fluid className="h-100">
          <Row className="h-100">
            {/* Desktop Sidebar */}
            <Col lg={3} xl={2} className="d-none d-lg-block sidebar-col">
              <div className="sidebar-desktop">
                <SidebarContent />
              </div>
            </Col>

            {/* Main Content */}
            <Col lg={9} xl={10} className="main-content-col">
              <div className="main-content">
                {children}
              </div>
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
            <SidebarContent isMobile={true} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default AppLayout;
