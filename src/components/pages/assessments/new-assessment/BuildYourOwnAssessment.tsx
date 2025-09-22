import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAPI } from "@/hooks/useAPI";
import { Player } from "@/types/player";
import { OptionType } from "@/components/common/dropdown/LumexDropdownTypes";
import PageHeader from "@/components/common/page-header/PageHeader";
import { ReactGrid, Column, CellChange, DropdownCell } from "@silevis/reactgrid";
import { Modal } from "react-bootstrap";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";
import "./NewAssessmentPage.scss";
import "@silevis/reactgrid/styles.css";
import { orderBy } from "lodash";
import { TbCategory2 } from "react-icons/tb";
import { applyCellChanges } from "../../../../utils/applyCellChanges";

export type GridAssessment = {
  id: number;
  playerId?: number;
  playerName?: string;
  date?: Date;
  [key: string]: any;
  // Add an optional property to track if the dropdown is open
  isOpen: boolean;
};

const BuildYourOwnAssessment: React.FC = () => {
  const { getPlayersByCoachId, getAllMetrics } = useAPI();
  const { userProfile } = useAuth();

  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(true);
  const [playerOptions, setPlayerOptions] = useState<OptionType[]>([]);
  const [assessments, setAssessments] = useState<GridAssessment[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  // const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);
  const [metricOptions, setMetricOptions] = useState<OptionType[]>([]);

  const isMetricSelected = (): boolean => {
    return metricOptions.some((m) => m.selected);
  };

  const getRows = (assessments: GridAssessment[]) => {
    const getCellObject = (assessment: GridAssessment, col: Column) => {
      switch (col.columnId) {
        case "playerId":
          const dropdownValues = playerOptions.map((p) => ({ label: p.label, value: String(p.value) })) as {
            label: string;
            value: string;
          }[];
          return {
            type: "dropdown",
            selectedValue: assessment.playerName || "",
            inputValue: assessment.playerName || "",
            isOpen: assessment.isOpen,
            values: dropdownValues,
            columnId: col.columnId,
          } as DropdownCell;
        case "date":
          return { type: "date", date: assessment.date || "", columnId: col.columnId };
        default:
          return { type: "text", text: assessment[col.columnId] || "", columnId: col.columnId };
      }
    };

    let _rows = [
      {
        rowId: "header",
        cells: columns.map((col) => ({
          type: "header",
          text: String(col.columnId).replace("playerId", "Player").replace("date", "Date"),
          columnId: col.columnId,
        })),
      },
      ...assessments.map((assessment) => ({
        rowId: assessment.id,
        cells: columns.map((col) => getCellObject(assessment, col)),
      })),
    ];
    return _rows;
  };

  const handleSelectMetric = (value: string): void => {
    setMetricOptions(metricOptions.map((m) => (String(m.value) === value ? { ...m, selected: !m.selected } : m)));
  };

  const handleBeginAssessment = (): void => {
    if (isMetricSelected()) {
      setShowMetricsModal(false);
    }
  };

  const handleCellChanges = (changes: CellChange<any>[]) => {
    setAssessments((prevAssessments) => applyCellChanges(changes, prevAssessments));
  };

  useEffect(() => {
    if (!userProfile) return;

    (async () => {
      try {
        const _players = await getPlayersByCoachId(userProfile.id);
        const options = _players.map((p: Player) => ({
          value: p.id!,
          label: `${p.firstName} ${p.lastName}`,
          selected: false,
        }));
        setPlayerOptions(options);

        const _metrics = await getAllMetrics();
        setMetricOptions(
          orderBy(_metrics, ["categorySort", "metricSort"], ["asc", "asc"]).map((m) => ({
            value: m.id!,
            label: `${m.metric!}${m.unit ? ` (${m.unit})` : ""}`,
            group: m.category,
            selected: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [userProfile, getPlayersByCoachId, getAllMetrics]);

  useEffect(() => {
    const _selectedMetrics = metricOptions.filter((m) => m.selected).map((m) => ({ value: m.value, label: m.label }));

    const _assessments: GridAssessment[] = [
      {
        id: 0,
        playerId: 0,
        playerName: "",
        date: undefined,
        isOpen: false,
      },
    ];
    _selectedMetrics.forEach((m) => {
      _assessments[0][String(m.label)] = "";
    });

    setAssessments(_assessments);
  }, [metricOptions]);

  useEffect(() => {
    if (showMetricsModal || assessments.length === 0 || playerOptions.length === 0) return;

    const _selectedMetrics = metricOptions.filter((m) => m.selected).map((m) => ({ value: m.value, label: m.label }));

    if (_selectedMetrics.length === 0) return;

    const _columns: Column[] = [
      { columnId: "playerId", width: 180 },
      { columnId: "date", width: 150 },
    ];
    _selectedMetrics.forEach((m) => _columns.push({ columnId: m.label, width: m.label.length * 7 + 30 }));
    setColumns(_columns);
  }, [metricOptions, playerOptions, showMetricsModal, assessments]);

  return (
    <>
      <PageHeader
        title={"Build Your Own Assessment"}
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
          <Modal.Body style={{ maxHeight: "60dvh", minHeight: "40dvh", overflowY: "auto", padding: "10px 40px" }}>
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
