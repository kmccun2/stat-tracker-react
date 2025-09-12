import React from "react";
import { Container, Alert, Card } from "react-bootstrap";
import {
  FaCog,
  FaUser,
  FaLock,
  FaDatabase,
  FaPalette,
  FaFileImport,
} from "react-icons/fa";
import PageHeader from "../../common/PageHeader";

const SettingsPage: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure application preferences and data sources"
        icon={<FaCog />}
      />

      {/* Main Content  */}
      <div className="page-main-content">
        <div>
          <Alert variant="info" className="text-center">
            <Alert.Heading>Additional Settings Coming Soon!</Alert.Heading>
            <p>More configuration options planned for future development:</p>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaUser /> Coach profile management
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaLock /> Authentication settings
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <FaFileImport /> Data import/export options
              </li>
              <li className="d-flex align-items-center justify-content-center gap-2">
                <FaPalette /> UI customization
              </li>
            </ul>
          </Alert>
        </div>

        <div className="d-flex gap-3 mt-4">
          <div className="flex-fill">
            <Card className="h-100 border-0">
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                  <FaUser /> User Management
                </Card.Title>
                <Card.Text className="text-muted">
                  Manage coach profiles, authentication, and access permissions.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="flex-fill">
            <Card className="h-100 border-0">
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                  <FaDatabase /> Data Management
                </Card.Title>
                <Card.Text className="text-muted">
                  Import/export data, backup settings, and configure data
                  sources.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
