// Styles
import "./DashboardPage.scss";
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Form,
  Badge,
  Alert,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUser,
  FaChartLine,
  FaFilter,
  FaTimes,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import PageHeader from "@/components/common/PageHeader";

// Type definitions
interface Assessment {
  id: number;
  player_id: number;
  metric: string;
  value: number;
  notes?: string;
  recorded_at: string;
  player_name?: string;
}

interface AssessmentType {
  assessment_type: string;
  category: string;
  format?: string;
}

interface TimeframeOption {
  value: string;
  label: string;
}

interface SummaryStats {
  totalAssessments: number;
  uniquePlayers: number;
  avgPerPlayer: number;
  recentActivity: number;
}

const DashboardPage: React.FC = () => {
  const { apiService } = useData();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1m");
  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState<
    string[]
  >([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>(
    []
  );

  const timeframeOptions: TimeframeOption[] = [
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" },
    { value: "1m", label: "1 Month" },
    { value: "3m", label: "3 Months" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" },
    { value: "all", label: "All Time" },
  ];

  useEffect(() => {
    fetchData();
  }, [selectedTimeframe]);

  useEffect(() => {
    filterAssessments();
  }, [assessments, selectedAssessmentTypes]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      // Fetch assessments and assessment types in parallel
      const [assessmentsResponse, typesResponse] = await Promise.all([
        apiService.getAssessments(selectedTimeframe),
        apiService.getMetrics(),
      ]);

      if (assessmentsResponse.success) {
        setAssessments(assessmentsResponse.data);
      } else {
        throw new Error("Failed to fetch assessments");
      }

      if (typesResponse.success) {
        setAssessmentTypes(typesResponse.data);
      } else {
        throw new Error("Failed to fetch assessment types");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterAssessments = (): void => {
    if (selectedAssessmentTypes.length === 0) {
      setFilteredAssessments(assessments);
    } else {
      const filtered = assessments.filter((assessment: Assessment) =>
        selectedAssessmentTypes.includes(assessment.metric)
      );
      setFilteredAssessments(filtered);
    }
  };

  const fetchAssessments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAssessments(selectedTimeframe);
      if (response.success) {
        setAssessments(response.data);
      } else {
        throw new Error("Failed to fetch assessments");
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
      setError("Failed to load assessments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedTimeframe(e.target.value);
  };

  const handleAssessmentTypeToggle = (assessmentType: string): void => {
    setSelectedAssessmentTypes((prev) => {
      if (prev.includes(assessmentType)) {
        return prev.filter((type) => type !== assessmentType);
      } else {
        return [...prev, assessmentType];
      }
    });
  };

  const clearAssessmentTypeFilters = (): void => {
    setSelectedAssessmentTypes([]);
  };

  const getUniqueCategories = (): string[] => {
    const categories = [
      ...new Set(assessmentTypes.map((type) => type.category)),
    ];
    return categories.filter((category) => category); // Remove any null/undefined categories
  };

  const handleNewAssessment = (): void => {
    navigate("/assessment-selection");
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatResultValue = (
    value: number | null | undefined,
    formatType?: string
  ): string => {
    if (value === null || value === undefined) return "N/A";

    switch (formatType) {
      case "time":
        return `${value}s`;
      case "distance":
        return `${value}"`;
      case "velocity":
        return `${value} mph`;
      case "percentage":
        return `${value}%`;
      case "count":
        return value.toString();
      default:
        return value.toString();
    }
  };

  // Calculate summary statistics
  const summaryStats: SummaryStats = {
    totalAssessments: filteredAssessments.length,
    uniquePlayers: [...new Set(filteredAssessments.map((a) => a.player_id))]
      .length,
    avgPerPlayer:
      filteredAssessments.length > 0
        ? parseFloat(
            (
              filteredAssessments.length /
              [...new Set(filteredAssessments.map((a) => a.player_id))].length
            ).toFixed(1)
          )
        : 0,
    recentActivity: filteredAssessments.filter((a) => {
      const assessmentDate = new Date(a.recorded_at);
      const daysSince =
        (Date.now() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length,
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of assessment activity and performance tracking"
        icon={<FaTachometerAlt />}
      />

      {/* Main Content */}
      <div className="page-main-content">
        {/* Timeframe Selector */}
        <div className="mb-4">
          <div className="timeframe-selector">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaCalendarAlt className="text-muted" />
              <label className="form-label mb-0">Time Range</label>
            </div>
            <Form.Select
              value={selectedTimeframe}
              onChange={handleTimeframeChange}
              style={{ maxWidth: "200px" }}
            >
              {timeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {/* Assessment Type Filter */}
        <div className="mb-4">
          <Card className="border-0">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FaFilter className="text-primary" />
                  <h6 className="mb-0">Filter by Assessment Type</h6>
                </div>
                {selectedAssessmentTypes.length > 0 && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={clearAssessmentTypeFilters}
                  >
                    <FaTimes className="me-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2">
                {getUniqueCategories().map((category) => (
                  <div key={category} className="mb-2">
                    <small className="text-muted fw-bold d-block mb-1">
                      {category}
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                      {assessmentTypes
                        .filter((type) => type.category === category)
                        .map((type) => (
                          <Badge
                            key={type.assessment_type}
                            bg={
                              selectedAssessmentTypes.includes(
                                type.assessment_type
                              )
                                ? "primary"
                                : "light"
                            }
                            text={
                              selectedAssessmentTypes.includes(
                                type.assessment_type
                              )
                                ? "white"
                                : "dark"
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleAssessmentTypeToggle(type.assessment_type)
                            }
                            className="user-select-none"
                          >
                            {type.assessment_type}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedAssessmentTypes.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted">
                    Showing {filteredAssessments.length} of {assessments.length}{" "}
                    assessments
                    {selectedAssessmentTypes.length > 0 && (
                      <span>
                        {" "}
                        • Filtered by: {selectedAssessmentTypes.join(", ")}
                      </span>
                    )}
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
            <Card
              className="h-100 border-0"
              style={{ minWidth: "200px", flex: "1 1 auto", maxWidth: "250px" }}
            >
              <Card.Body className="text-center">
                <FaChartLine className="text-primary mb-2" size={32} />
                <h3 className="mb-1">{summaryStats.totalAssessments}</h3>
                <p className="text-muted mb-0">Total Assessments</p>
              </Card.Body>
            </Card>
            <Card
              className="h-100 border-0"
              style={{ minWidth: "200px", flex: "1 1 auto", maxWidth: "250px" }}
            >
              <Card.Body className="text-center">
                <FaUser className="text-success mb-2" size={32} />
                <h3 className="mb-1">{summaryStats.uniquePlayers}</h3>
                <p className="text-muted mb-0">Active Players</p>
              </Card.Body>
            </Card>
            <Card
              className="h-100 border-0"
              style={{ minWidth: "200px", flex: "1 1 auto", maxWidth: "250px" }}
            >
              <Card.Body className="text-center">
                <FaTachometerAlt className="text-info mb-2" size={32} />
                <h3 className="mb-1">{summaryStats.avgPerPlayer}</h3>
                <p className="text-muted mb-0">Avg per Player</p>
              </Card.Body>
            </Card>
            <Card
              className="h-100 border-0"
              style={{ minWidth: "200px", flex: "1 1 auto", maxWidth: "250px" }}
            >
              <Card.Body className="text-center">
                <FaCalendarAlt className="text-warning mb-2" size={32} />
                <h3 className="mb-1">{summaryStats.recentActivity}</h3>
                <p className="text-muted mb-0">This Week</p>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Recent Assessments Table */}
        <div>
          <Card className="border-0">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FaClipboardList className="text-primary" />
                <h5 className="mb-0">Recent Assessments</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredAssessments.length === 0 ? (
                <div className="text-center py-5">
                  <FaClipboardList className="text-muted mb-3" size={48} />
                  <h5 className="text-muted">No assessments found</h5>
                  <p className="text-muted">
                    {selectedAssessmentTypes.length > 0
                      ? "No assessments match your current filters."
                      : "Start by adding your first assessment."}
                  </p>
                  <Button variant="primary" onClick={handleNewAssessment}>
                    <FaPlus className="me-2" />
                    Add First Assessment
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Player</th>
                        <th>Assessment Type</th>
                        <th>Result</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessments
                        .slice(0, 50)
                        .map((assessment: Assessment) => (
                          <tr key={assessment.id}>
                            <td>
                              <small className="text-muted">
                                {formatDate(assessment.recorded_at)}
                              </small>
                            </td>
                            <td>
                              <Badge bg="outline-primary">
                                {assessment.player_name ||
                                  `Player ${assessment.player_id}`}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="secondary">{assessment.metric}</Badge>
                            </td>
                            <td>
                              <strong>
                                {formatResultValue(assessment.value)}
                              </strong>
                            </td>
                            <td>
                              <small className="text-muted">
                                {assessment.notes || "-"}
                              </small>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
            {filteredAssessments.length > 0 && (
              <Card.Footer className="bg-white border-top text-muted">
                <small>
                  Showing {filteredAssessments.length} assessment
                  {filteredAssessments.length !== 1 ? "s" : ""}
                  {selectedTimeframe !== "all" &&
                    ` from the last ${timeframeOptions
                      .find((t) => t.value === selectedTimeframe)
                      ?.label.toLowerCase()}`}
                  {selectedAssessmentTypes.length > 0 &&
                    ` • Filtered by: ${selectedAssessmentTypes.join(", ")}`}
                </small>
              </Card.Footer>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
