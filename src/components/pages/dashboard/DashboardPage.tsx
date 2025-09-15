// Font Awesome React icons for visual elements
import React, { memo } from "react";

// Icon imports
import { FaTachometerAlt } from "react-icons/fa";
import { LuClipboardPen } from "react-icons/lu";

// Shared page header component
import PageHeader from "../../common/page-header/PageHeader";

/**
 * Actions component for the Dashboard page header
 */
const DashboardActions: React.FC<{
  onNewAssessmentClick: () => void;
}> = ({ onNewAssessmentClick }) => (
  <button
    className="lumex-btn primary"
    onClick={onNewAssessmentClick}
    aria-label="Add new assessment"
  >
    <LuClipboardPen />
    <span className="ms-2">New Assessment</span>
  </button>
);

const DashboardPage: React.FC = memo(() => {
  // Handlers
  const handleNewAssessmentClick = () => {
    // Logic to open new assessment modal or navigate to assessment page
    alert("New Assessment button clicked");
  };

  return (
    <>
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of assessment activity and performance tracking"
        icon={<FaTachometerAlt />}
        actions={
          <DashboardActions
            onNewAssessmentClick={() => handleNewAssessmentClick()}
          />
        }
      />

      {/* Main Content */}
      <div className="page-main-content"></div>
    </>
  );
});

// Add display name for debugging
DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
