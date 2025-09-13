// Font Awesome React icons for visual elements
import React, { memo } from 'react';
import { FaTachometerAlt } from 'react-icons/fa';

// Shared page header component
import PageHeader from '../../common/page-header/PageHeader';

const DashboardPage: React.FC = memo(() => {
  return (
    <>
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of assessment activity and performance tracking"
        icon={<FaTachometerAlt />}
      />

      {/* Main Content */}
      <div className="page-main-content"></div>
    </>
  );
});

// Add display name for debugging
DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
