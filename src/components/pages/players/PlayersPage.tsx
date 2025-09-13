import React, { memo, useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';

import PageHeader from '../../common/page-header/PageHeader';
import LumexSpinner from '../../common/spinner/LumexSpinner';

const PlayersPage: React.FC = memo(() => {
  // Local state
  const [loading, setLoading] = useState(false);

  // Hook to fetch players from db
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      // Fetch players logic would go here
    };

    fetchPlayers();
  }, []);

  return (
    <>
      <PageHeader
        title="Players"
        subtitle="Manage your team roster and track individual progress"
        icon={<FaUsers />}
      />

      {/* Main Content */}
      {loading ? (
        <div className="h-100 w-100">
          <LumexSpinner />
        </div>
      ) : (
        <div className="page-main-content"></div>
      )}
    </>
  );
});

// Add display name for debugging
PlayersPage.displayName = 'PlayersPage';

export default PlayersPage;
