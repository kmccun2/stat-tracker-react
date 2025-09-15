// React Core
import "./MetricsPage.scss";
import React, { memo, useEffect, useState } from "react";

// Icons
import { RiPencilRulerLine } from "react-icons/ri";
import { FaBaseballBatBall } from "react-icons/fa6";
import { PiPersonSimpleThrowBold } from "react-icons/pi";
import { FaDumbbell, FaRuler } from "react-icons/fa";
import { IoMdStopwatch } from "react-icons/io";
import { ImPower } from "react-icons/im";
import { TbCategory2 } from "react-icons/tb";
import { GrYoga } from "react-icons/gr";

// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

// Components
import PageHeader from "@/components/common/page-header/PageHeader";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";
import AddMetricModal from "./AddMetricModal";
import TableCardToggle from "@/components/common/table-card-toggle/TableCardToggle";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Metric } from "@/types/metric";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";
import { HiOutlinePlus } from "react-icons/hi";

/**
 * Get icon for category based on category name
 */
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "General":
      return <RiPencilRulerLine className="category-icon" />;
    case "Hitting":
      return <FaBaseballBatBall className="category-icon" />;
    case "Throwing":
      return <PiPersonSimpleThrowBold className="category-icon" />;
    case "Strength":
      return <FaDumbbell className="category-icon" />;
    case "Speed":
      return <IoMdStopwatch className="category-icon" />;
    case "Power":
      return <ImPower className="category-icon" />;
    case "Mobility":
      return <GrYoga className="category-icon" />;
    default:
      return <TbCategory2 className="category-icon" />;
  }
};

/**
 * Actions component for the Metrics page header
 */
const MetricActions: React.FC<{
  onAddMetric: () => void;
}> = ({ onAddMetric }) => (
  <button
    className="lumex-btn primary"
    onClick={onAddMetric}
    aria-label="Add new metric"
  >
    <HiOutlinePlus />
    <span className="ms-2">Add Metric</span>
  </button>
);

/**
 * MetricsPage Component
 * Manages assessment metrics for player evaluations
 */
const MetricsPage: React.FC = memo(() => {
  // State management
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof Metric>("category");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchFilter, setSearchFilter] = useState("");

  // Hooks
  const { getAllMetrics } = useAPI();
  const dispatch = useAppDispatch();

  // Event handlers
  const handleAddMetricClick = () => {
    setShowAddMetricModal(true);
  };

  const handleCloseModal = () => {
    setShowAddMetricModal(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  const showErrorToast = (message: string) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title: "Error Fetching Metrics",
        message,
        type: "error",
      } as ToastItemType)
    );
  };

  // Data fetching
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const fetchedMetrics = await getAllMetrics();
      setMetrics(fetchedMetrics);
      console.log("Metrics fetched:", fetchedMetrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      showErrorToast("Failed to fetch metrics.");
    } finally {
      setLoading(false);
    }
  };

  // Sorting functionality
  const handleRequestSort = (property: keyof Metric) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter metrics based on search input
  const filteredMetrics = metrics.filter((metric) => {
    if (!searchFilter.trim()) return true;

    const searchTerm = searchFilter.toLowerCase();
    const metricName = metric.metric?.toLowerCase() || "";
    const category = metric.category?.toLowerCase() || "";

    return metricName.includes(searchTerm) || category.includes(searchTerm);
  });

  const sortedMetrics = filteredMetrics.slice().sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (orderBy === "metric" || orderBy === "category") {
      aValue = a[orderBy]?.toLowerCase() || "";
      bValue = b[orderBy]?.toLowerCase() || "";
    } else if (orderBy === "metricSort") {
      aValue = a[orderBy] || 0;
      bValue = b[orderBy] || 0;
    } else {
      aValue = a[orderBy];
      bValue = b[orderBy];
    }

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Effects
  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sort metrics for cards view (by categorySort, then metricSort)
  const cardSortedMetrics = filteredMetrics.slice().sort((a, b) => {
    // First compare by categorySort
    if (a.categorySort !== b.categorySort) {
      return a.categorySort - b.categorySort;
    }
    // If categorySort is the same, compare by metricSort
    return a.metricSort - b.metricSort;
  });

  // Group metrics by category for cards view
  const groupedMetrics = cardSortedMetrics.reduce(
    (acc, metric) => {
      const category = metric.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metric);
      return acc;
    },
    {} as Record<string, Metric[]>
  );

  // Render helpers
  const MetricCards = () => (
    <div className="metrics-container">
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <div key={category} className="metric-category-section">
          <h4 className="category-title">
            {getCategoryIcon(category)}
            {category}
          </h4>
          <div className="metric-list">
            {categoryMetrics.map((metric, index) => (
              <div
                key={`${metric.category}-${metric.metricSort}-${index}`}
                className="metric-card"
              >
                <h5 className="card-title">{metric.metric}</h5>
                <p className="card-content">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const MetricTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="metrics table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "metric"}
                direction={orderBy === "metric" ? order : "asc"}
                onClick={() => handleRequestSort("metric")}
              >
                Metric Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "category"}
                direction={orderBy === "category" ? order : "asc"}
                onClick={() => handleRequestSort("category")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "description"}
                direction={orderBy === "description" ? order : "asc"}
                onClick={() => handleRequestSort("description")}
              >
                Description
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMetrics.map((metric, index) => (
            <TableRow
              key={`${metric.category}-${metric.metricSort}-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {metric.metric}
              </TableCell>
              <TableCell>{metric.category}</TableCell>
              <TableCell>{metric.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <PageHeader
        title="Assessment Metrics"
        subtitle="Manage the metrics used for player assessments"
        icon={<FaRuler />}
        actions={<MetricActions onAddMetric={handleAddMetricClick} />}
      />

      {/* Main Content */}
      {loading && (
        <div className="h-100 w-100">
          <LumexSpinner />
        </div>
      )}

      {!loading && (
        <div className="page-main-content">
          {/* Metrics actions header  */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search metrics..."
              value={searchFilter}
              onChange={handleSearchChange}
            />
            <TableCardToggle view={view} setView={setView} />
          </div>

          {/* Metric cards/table */}
          {filteredMetrics.length === 0 ? (
            <div className="content-section">
              <div className="no-metrics-message">
                <TbCategory2 className="icon" />
                <h4>
                  {metrics.length === 0
                    ? "No metrics found"
                    : "No matching metrics"}
                </h4>
                <p>
                  {metrics.length === 0
                    ? 'Click "Add Metric" to create a new assessment metric.'
                    : "Try adjusting your search criteria."}
                </p>
              </div>
            </div>
          ) : (
            <>{view === "cards" ? <MetricCards /> : <MetricTable />}</>
          )}
        </div>
      )}

      <AddMetricModal
        show={showAddMetricModal}
        onClose={handleCloseModal}
        setMetrics={setMetrics}
      />
    </>
  );
});

// Add display name for debugging
MetricsPage.displayName = "MetricsPage";

export default MetricsPage;
