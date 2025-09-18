import "./NewAssessmentPage.scss";
import PageHeader from "@/components/common/page-header/PageHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "@/hooks/useAPI";
import { useAuth } from "@/context/AuthContext";
import { Player } from "@/types/player";
import { LumexDropdownProps, OptionType } from "@/components/common/dropdown/LumexDropdownTypes";
import LumexDropdown from "@/components/common/dropdown/LumexDropdown";

const NewAssessmentPage: React.FC = () => {
  // Imports from hooks
  const { type } = useParams<{ type: string }>();
  const { getPlayersByCoachId, getAllMetrics } = useAPI();
  const { userProfile } = useAuth();

  // Local state
  const [playerOptions, setPlayerOptions] = useState<OptionType[]>([]);
  const [playerDropdownProps, setPlayerDropdownProps] = useState<LumexDropdownProps>();

  // Metrics dropdown state
  const [metricOptions, setMetricOptions] = useState<OptionType[]>([]);
  const [metricDropdownProps, setMetricDropdownProps] = useState<LumexDropdownProps>();

  // Utils
  const getAssessmentTitle = (type: string) => {
    switch (type) {
      case "hitting-session":
        return "Hitting Session Assessment";
      case "bullpen":
        return "Bullpen Assessment";
      case "weightroom-maxes":
        return "Weightroom Max Assessment";
      case "showcase-skills":
        return "Showcase Skills Assessment";
      case "mobility-screening":
        return "Mobility Screening Assessment";
      case "build-your-own":
        return "Custom Assessment";
      default:
        return "New Assessment";
    }
  };

  // Hooks
  useEffect(() => {
    if (!userProfile) return;
    (async () => {
      // Fetch players from db
      let _players = await getPlayersByCoachId(userProfile.id);
      setPlayerOptions(
        _players.map((p: Player) => ({ value: p.id!, label: `${p.firstName} ${p.lastName}`, selected: false }))
      );
      // Fetch metrics from db
      let _metrics = await getAllMetrics();
      setMetricOptions(_metrics.map((m) => ({ value: m.id!, label: m.metric!, selected: false })));
    })();
  }, [userProfile]);

  // Update metrics dropdown props when metricOptions changes
  useEffect(() => {
    if (!metricOptions) return;
    setMetricDropdownProps({
      label: "Metrics",
      placeholder: "Select metrics",
      multiSelect: true,
      selectAll: true,
      options: metricOptions,
      setOptions: setMetricOptions,
    });
  }, [metricOptions]);

  // Update players dropdown props when playerOptions changes
  useEffect(() => {
    if (!playerOptions) return;
    setPlayerDropdownProps({
      label: "Players",
      placeholder: "Select players",
      multiSelect: true,
      selectAll: true,
      options: playerOptions,
      setOptions: setPlayerOptions,
    });
  }, [playerOptions]);

  return (
    <>
      <PageHeader
        title={getAssessmentTitle(type || "")}
        subtitle="Enter assessment scores for selected players and metrics"
        actions={<></>}
      />

      {metricDropdownProps ? (
        <div className="page-main-content">
          {/* Filters Section */}
          <div className="filters-section">
            {/* Players filter */}
            {playerDropdownProps && <LumexDropdown props={playerDropdownProps} />}
            {/* Metrics filter */}
            {metricDropdownProps && <LumexDropdown props={metricDropdownProps} />}
            {/* Clear filters button */}
            <button
              className="lumex-btn clear align-self-end"
              onClick={() => {
                setPlayerOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
                setMetricOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default NewAssessmentPage;
