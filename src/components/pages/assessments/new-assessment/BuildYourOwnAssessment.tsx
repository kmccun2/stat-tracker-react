// React imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Context and hooks
import { useAuth } from "@/context/AuthContext";
import { useAPI } from "@/hooks/useAPI";

// Types
import { Player } from "@/types/player";
import { Assessment } from "@/types/assessment";
import { OptionType } from "@/components/common/dropdown/LumexDropdownTypes";

// Components
import PageHeader from "@/components/common/page-header/PageHeader";
import { ReactGrid, Column, CellChange, DefaultCellTypes } from "@silevis/reactgrid";
import { Modal } from "react-bootstrap";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";

// Styles
import "./NewAssessmentPage.scss";
import "@silevis/reactgrid/styles.css";

// Utils
import { orderBy } from "lodash";
import { TbCategory2 } from "react-icons/tb";
import { applyCellChanges } from "@/utils/handleCellChanges";

const BuildYourOwnAssessment: React.FC = () => {
  // Hooks and params
  const { type } = useParams<{ type: string }>();
  const { getPlayersByCoachId, getAllMetrics } = useAPI();
  const { userProfile } = useAuth();

  // Local state
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(true);
  const [playerOptions, setPlayerOptions] = useState<OptionType[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [metricOptions, setMetricOptions] = useState<OptionType[]>([]);

  // Utility functions
  const getAssessmentTitle = (type: string): string => {
    const titles: Record<string, string> = {
      "hitting-session": "Hitting Session Assessment",
      bullpen: "Bullpen Assessment",
      "weightroom-maxes": "Weightroom Max Assessment",
      "showcase-skills": "Showcase Skills Assessment",
      "mobility-screening": "Mobility Screening Assessment",
      "build-your-own": "Custom Assessment",
    };
    return titles[type] || "New Assessment";
  };

  const isMetricSelected = (): boolean => {
    return metricOptions.some((m) => m.selected);
  };

  const getRows = (assessments: Assessment[]) => {
    const getCellObject = (assessment: Assessment, col: Column) => {
      switch (col.columnId) {
        case "Player":
          return {
            type: "dropdown",
            text: assessment.playerName || "",
            values: playerOptions.map((p) => ({ label: p.label, value: p.value })),
          };
        case "Date":
          return { type: "date", date: assessment.date || "" };
        default:
          return { type: "text", text: assessment[col.columnId] || "" };
      }
    };

    return [
      {
        rowId: "header",
        cells: columns.map((col) => ({ type: "header", text: col.columnId })),
      },
      ...assessments.map((assessment, index) => ({
        rowId: index,
        cells: columns.map((col) => getCellObject(assessment, col)),
      })),
    ];
  };

  // Event handlers
  const handleSelectMetric = (value: string): void => {
    setMetricOptions(metricOptions.map((m) => (String(m.value) === value ? { ...m, selected: !m.selected } : m)));
  };

  const handleBeginAssessment = (): void => {
    setShowMetricsModal(false);
  };

  const handleCellChanges = (changes: CellChange<DefaultCellTypes>[]): void => {
    setAssessments((prevAssessments: Assessment[]) => {
      applyCellChanges(changes, prevAssessments);
      return [...prevAssessments];
    });
  };

  // Data fetching effect
  useEffect(() => {
    if (!userProfile) return;

    (async () => {
      // Fetch players
      const _players = await getPlayersByCoachId(userProfile.id);
      setPlayerOptions(
        _players.map((p: Player) => ({
          value: p.id!,
          label: `${p.firstName} ${p.lastName}`,
          selected: false,
        }))
      );

      // Fetch metrics
      const _metrics = await getAllMetrics();
      setMetricOptions(
        orderBy(_metrics, ["categorySort", "metricSort"], ["asc", "asc"]).map((m) => ({
          value: m.id!,
          label: m.metric!,
          group: m.category,
          selected: false,
        }))
      );
    })();
  }, [userProfile, getPlayersByCoachId, getAllMetrics]);

  // Update assessments when metrics change
  useEffect(() => {
    const _selectedMetrics = metricOptions.filter((m) => m.selected).map((m) => ({ value: m.value, label: m.label }));

    const _assessments: any[] = [];
    for (let i = 0; i < 1000; i++) {
      const assessment: any = {
        id: i,
        playerId: "",
        playerName: "",
        date: "",
      };
      _selectedMetrics.forEach((m) => {
        assessment[String(m.label)] = "";
      });
      _assessments.push(assessment);
    }

    setAssessments(_assessments);
  }, [metricOptions]);

  // Initialize table columns and rows when metrics or players change
  useEffect(() => {
    if (showMetricsModal || assessments.length === 0) return;

    const _selectedMetrics = metricOptions.filter((m) => m.selected).map((m) => ({ value: m.value, label: m.label }));

    if (_selectedMetrics.length === 0) return;

    // Build columns
    const _columns: Column[] = [
      { columnId: "Player", width: 180 },
      { columnId: "Date", width: 150 },
    ];
    _selectedMetrics.forEach((m) => _columns.push({ columnId: m.label, width: m.label.length * 7 + 30 }));
    setColumns(_columns);
  }, [metricOptions, playerOptions, showMetricsModal, assessments]);

  return (
    <>
      <PageHeader
        title={getAssessmentTitle(type || "")}
        subtitle="Enter assessment scores for selected players and metrics"
        icon={<TbCategory2 />}
        actions={
          <button className="lumex-btn primary" onClick={() => alert("Assessment submitted!")}>
            Submit Assessment
          </button>
        }
      />

      <div className="page-main-content p-2">
        <div className="assessment-table-container">
          {!showMetricsModal && columns.length > 0 && assessments.length > 0 && (
            <ReactGrid
              rows={getRows(assessments)}
              columns={columns}
              stickyTopRows={1}
              stickyLeftColumns={1}
              onCellsChanged={handleCellChanges}
              enableRangeSelection
            />
          )}
        </div>
      </div>

      {showMetricsModal && (
        <Modal show={showMetricsModal}>
          <Modal.Header>
            <Modal.Title>Select Metrics</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "60dvh", minHeight: "40dvh", overflowY: "auto" }}>
            {metricOptions.length > 0 ? (
              Array.from(new Set(metricOptions.map((m) => m.group))).map((g) => (
                <div key={g}>
                  <strong>{g}</strong>
                  {metricOptions
                    .filter((m) => m.group === g)
                    .map((m) => (
                      <div key={m.value}>
                        <input
                          type="checkbox"
                          id={`metric-${m.value}`}
                          checked={m.selected}
                          onChange={() => handleSelectMetric(String(m.value))}
                        />
                        <label className="ms-2" htmlFor={`metric-${m.value}`}>
                          {m.label}
                        </label>
                      </div>
                    ))}
                </div>
              ))
            ) : (
              <LumexSpinner />
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className={`lumex-btn primary ${!isMetricSelected() ? "disabled" : ""}`}
              disabled={!isMetricSelected()}
              onClick={handleBeginAssessment}
              title={!isMetricSelected() ? "Select at least one metric to begin assessment" : ""}
            >
              Begin Assessment
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default BuildYourOwnAssessment;
