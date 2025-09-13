import React from 'react';
import { FaCog } from 'react-icons/fa';
import PageHeader from '../../common/page-header/PageHeader';

const SettingsPage: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure application preferences and data sources"
        icon={<FaCog />}
      />

      {/* Main Content  */}
      <div className="page-main-content"></div>
    </>
  );
};

export default SettingsPage;
