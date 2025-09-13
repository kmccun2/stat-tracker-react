// React Core
import PageHeader from '@/components/common/page-header/PageHeader';

// React Icons
import { FaRuler } from 'react-icons/fa';

const MetricsPage: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Assessment Metrics"
        subtitle="Manage the metrics used for player assessments"
        icon={<FaRuler />}
      />

      {/* Main Content */}
      <div className="page-main-content"></div>
    </>
  );
};

export default MetricsPage;
