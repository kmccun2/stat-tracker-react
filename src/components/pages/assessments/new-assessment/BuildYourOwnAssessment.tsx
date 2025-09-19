// React imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Context and hooks
import { useAuth } from "@/context/AuthContext";
import { useAPI } from "@/hooks/useAPI";

// Types
import { Player } from "@/types/player";
import { LumexDropdownProps, OptionType } from "@/components/common/dropdown/LumexDropdownTypes";

// Components
import PageHeader from "@/components/common/page-header/PageHeader";
import { ReactGrid, Column, Row, CellChange } from "@silevis/reactgrid";

// Styles
import "./NewAssessmentPage.scss";
import "@silevis/reactgrid/styles.css";
import { Modal } from "react-bootstrap";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";

// Utils
import { orderBy } from "lodash";
import { TbCategory2 } from "react-icons/tb";

const BuildYourOwnAssessment: React.FC = () => {
  // Imports from hooks
  const { type } = useParams<{ type: string }>();
  const { getPlayersByCoachId, getAllMetrics } = useAPI();
  const { userProfile } = useAuth();

  // Local state
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(true);
  const [playerOptions, setPlayerOptions] = useState<OptionType[]>([]);
  const [playerDropdownProps, setPlayerDropdownProps] = useState<LumexDropdownProps>();

  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  // Metrics dropdown state
  const [metricOptions, setMetricOptions] = useState<OptionType[]>([]);

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

  // Event handlers
  const handleSelectMetric = (value: string) => {
    setMetricOptions(metricOptions.map((m) => (String(m.value) === value ? { ...m, selected: !m.selected } : m)));
  };

  const handleBeginAssessment = () => {
    setShowMetricsModal(false);
  };

  const handleAddBlankRow = () => {
    let newRowId = rows.length > 1 ? (rows[rows.length - 1].rowId as number) + 1 : 1;
    let newRow: Row = {
      rowId: newRowId,
      cells: columns.map((col) =>
        col.columnId === "playerName"
          ? {
              type: "dropdown" as const,
              text: "",
              values: playerOptions.map((p) => ({ label: p.label, value: String(p.value) })),
            }
          : col.columnId === "date"
            ? { type: "date" as const, text: "" }
            : { type: "text" as const, text: "" }
      ),
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleCellChanges = (changes: CellChange[]) => {
    console.log("Changes:", changes);
    let _rows = [...rows];
    changes.forEach((change) => {
      const rowIndex = _rows.findIndex((row) => row.rowId === change.rowId);
      const columnIndex = _rows[rowIndex].cells.findIndex((_, index) => columns[index]?.columnId === change.columnId);
      if (rowIndex !== -1 && columnIndex !== -1) {
        _rows[rowIndex] = {
          ..._rows[rowIndex],
          cells: _rows[rowIndex].cells.map((cell, index) => (index === columnIndex ? change.newCell : cell)),
        };
      }
      return _rows;
    });
    setRows(_rows);
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
      setMetricOptions(
        orderBy(_metrics, ["categorySort", "metric"], ["asc", "asc"]).map((m) => ({
          value: m.id!,
          label: m.metric!,
          group: m.category,
          selected: false,
        }))
      );
    })();
  }, [userProfile]);

  // Update players dropdown props when playerOptions changes
  useEffect(() => {
    if (!playerOptions) return;
    setPlayerDropdownProps({
      label: "Players",
      placeholder: "Select player",
      options: playerOptions,
      searchable: true,
      setOptions: setPlayerOptions,
    });
  }, [playerOptions]);

  // Initialize table columns and rows when metrics or players change
  useEffect(() => {
    let _selectedMetrics = metricOptions.filter((m) => m.selected).map((m) => ({ value: m.value, label: m.label }));

    // Build columns array
    let _columns = [
      { columnId: "playerName", width: 180 },
      { columnId: "date", width: 150 },
    ];
    _selectedMetrics.forEach((m) => _columns.push({ columnId: m.label, width: m.label.length * 7 + 30 }));

    // Build headers row
    let _headerRow = {
      rowId: "header",
      cells: [
        { type: "header" as const, text: "Player Name" },
        { type: "header" as const, text: "Date" },
      ],
    };
    _selectedMetrics.forEach((m) =>
      // Push metrics selected from dropdown
      _headerRow.cells.push({
        type: "header" as const,
        text: m.label,
      })
    );

    let _rows = [_headerRow] as Row[];
    for (let i = 1; i < 1001; i++)
      // Create 1000 blank rows to start
      _rows.push({
        rowId: String(i),
        cells: _columns.map((col) =>
          col.columnId === "playerName"
            ? {
                type: "dropdown" as const,
                text: "",
                values: playerOptions.map((p) => ({ label: p.label, value: String(p.value) })),
              }
            : col.columnId === "date"
              ? { type: "date" as const, text: "" }
              : { type: "text" as const, text: "" }
        ),
      });

    setColumns(_columns);
    setRows(_rows);
  }, [metricOptions, playerOptions]);

  return (
    <>
      <PageHeader
        title={getAssessmentTitle(type || "")}
        subtitle="Enter assessment scores for selected players and metrics"
        icon={<TbCategory2 />}
        actions={
          <>
            <button className="lumex-btn primary" onClick={() => alert("Assessment submitted!")}>
              Submit Assessment
            </button>
          </>
        }
      />

      {playerDropdownProps ? (
        <div className="page-main-content p-0">
          {/* Assessment table section */}
          <div className="assessment-table-container">
            {!showMetricsModal && (
              <ReactGrid
                rows={rows}
                columns={columns}
                stickyTopRows={1}
                stickyLeftColumns={1}
                onCellsChanged={handleCellChanges}
                enableRangeSelection
              />
            )}
          </div>
        </div>
      ) : null}

      {showMetricsModal && (
        <Modal show={showMetricsModal} onHide={() => setShowMetricsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Metrics</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto", padding: "5px 20px" }}>
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
            <button className="lumex-btn primary" onClick={() => handleBeginAssessment()}>
              Begin Assessment
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default BuildYourOwnAssessment;
