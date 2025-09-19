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
import LumexDropdown from "@/components/common/dropdown/LumexDropdown";
import { ReactGrid, Column, Row } from "@silevis/reactgrid";

// Styles
import "./NewAssessmentPage.scss";
import "@silevis/reactgrid/styles.css";

const BuildYourOwnAssessment: React.FC = () => {
  // Imports from hooks
  const { type } = useParams<{ type: string }>();
  const { getPlayersByCoachId, getAllMetrics } = useAPI();
  const { userProfile } = useAuth();

  // Local state
  const [playerOptions, setPlayerOptions] = useState<OptionType[]>([]);
  const [playerDropdownProps, setPlayerDropdownProps] = useState<LumexDropdownProps>();

  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

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

  // Event handlers
  const handleAddBlankRow = () => {
    let newRowId = rows.length > 1 ? (rows[rows.length - 1].rowId as number) + 1 : 1;
    let newRow: Row = {
      rowId: newRowId,
      cells: columns.map((col) => ({ type: "text" as const, text: "" })),
    };
    setRows((prevRows) => [...prevRows, newRow]);
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
      searchable: true,
      options: metricOptions,
      setOptions: setMetricOptions,
    });
  }, [metricOptions]);

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
      { columnId: "playerName", width: 150 },
      { columnId: "date", width: 150 },
    ];
    _selectedMetrics.forEach((m) => _columns.push({ columnId: m.label, width: m.label.length * 7 + 30 }));

    // Build headers row
    let _headerRow = {
      rowId: "header",
      cells: [
        { type: "header" as const, text: "Player Name" },
        { type: "header" as const, text: "Date" },
      ] as { type: "header"; text: string }[],
    };
    _selectedMetrics.forEach((m) =>
      // Push metrics selected from dropdown
      _headerRow.cells.push({
        type: "header" as const,
        text: m.label,
      })
    );

    let _rows = [
      _headerRow,
      {
        rowId: 1,
        cells: _columns.map((col) => ({ type: "text" as const, text: "" })),
      },
    ];

    console.log(_columns, _rows);

    setColumns(_columns);
    setRows(_rows);
  }, [metricOptions, playerOptions]);

  return (
    <>
      <PageHeader
        title={getAssessmentTitle(type || "")}
        subtitle="Enter assessment scores for selected players and metrics"
        actions={<></>}
      />

      {metricDropdownProps && playerDropdownProps ? (
        <div className="page-main-content p-0">
          {/* Filters Section */}
          <div className="filters-section">
            <div className="dropdowns">
              {/* Metrics filter */}
              {metricDropdownProps && <LumexDropdown props={metricDropdownProps} />}
            </div>
            {/* Clear filters button */}
            <button
              className="lumex-btn clear ms-3"
              onClick={() => {
                setPlayerOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
                setMetricOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
              }}
            >
              Clear Filters
            </button>
          </div>

          {/* Action items */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div></div>
            <button className="lumex-btn primary me-3" onClick={() => handleAddBlankRow()}>
              Add Row
            </button>
          </div>

          {/* Assessment table section */}
          <div className="assessment-table-container">
            <ReactGrid rows={rows} columns={columns} stickyTopRows={1} stickyLeftColumns={1} enableRangeSelection />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BuildYourOwnAssessment;
