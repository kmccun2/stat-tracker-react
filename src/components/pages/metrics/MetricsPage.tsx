import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  ButtonGroup,
  ToggleButton,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaTable, FaTh } from "react-icons/fa";
import { useData } from "../../../context/DataContext";
import AddMetricModal from "./AddMetricModal";
import EditMetricModal from "./EditMetricModal";

// Type definitions
interface Metric {
  id?: number;
  assessment_type?: string;
  AssessmentType?: string;
  category?: string;
  Category?: string;
}

interface MetricsByCategory {
  [category: string]: Metric[];
}

type ViewMode = "table" | "cards";

const MetricsPage: React.FC = () => {
  const {
    assessmentTypes,
    addAssessmentType,
    updateAssessmentType,
    deleteAssessmentType,
    useBackend,
    apiService,
  } = useData();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  // Group metrics by category
  const metricsByCategory: MetricsByCategory = assessmentTypes.reduce(
    (acc: MetricsByCategory, metric: Metric) => {
      const category = metric.category || metric.Category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metric);
      return acc;
    },
    {}
  );

  const handleAddMetric = (newMetric: Metric): void => {
    addAssessmentType(newMetric);
  };

  const handleEditMetric = (metric: Metric): void => {
    setSelectedMetric(metric);
    setShowEditModal(true);
  };

  const handleUpdateMetric = (updatedMetric: Metric): void => {
    updateAssessmentType(updatedMetric);
  };

  const handleDeleteMetric = async (metric: Metric): Promise<void> => {
    setDeleteError("");

    if (
      !window.confirm(
        `Are you sure you want to delete "${
          metric.assessment_type || metric.AssessmentType
        }"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await apiService.deleteAssessmentType(metric.id);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete metric");
      }

      deleteAssessmentType(metric.id);
    } catch (error: any) {
      console.error("Error deleting metric:", error);
      setDeleteError(error.message || "Failed to delete metric");
    }
  };

  const renderTableView = (): JSX.Element => (
    <div className="table-responsive">
      <Table striped hover className="align-middle">
        <thead className="table-primary">
          <tr>
            <th>Metric Name</th>
            <th>Category</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessmentTypes.map((metric: Metric) => (
            <tr
              key={metric.id || `${metric.AssessmentType}-${metric.Category}`}
            >
              <td className="fw-bold">
                {metric.assessment_type || metric.AssessmentType}
              </td>
              <td>
                <Badge bg="secondary">
                  {metric.category || metric.Category}
                </Badge>
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditMetric(metric)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteMetric(metric)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const renderCardView = (): JSX.Element => (
    <div>
      {Object.entries(metricsByCategory).map(
        ([category, metrics]: [string, Metric[]]) => (
          <div key={category} className="mb-4">
            <h4 className="text-primary mb-3">
              <Badge bg="primary" className="me-2">
                {metrics.length}
              </Badge>
              {category}
            </h4>
            <Row className="g-3">
              {metrics.map((metric: Metric) => (
                <Col
                  key={
                    metric.id || `${metric.AssessmentType}-${metric.Category}`
                  }
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <Card className="h-100 border-0">
                    <Card.Body className="d-flex flex-column">
                      <div className="flex-grow-1">
                        <h6 className="card-title text-primary mb-2">
                          {metric.assessment_type || metric.AssessmentType}
                        </h6>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditMetric(metric)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteMetric(metric)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )
      )}
    </div>
  );

  const handleViewModeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setViewMode(e.currentTarget.value as ViewMode);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Assessment Metrics</h2>
              <p className="text-muted mb-0">
                Manage the metrics used for player assessments
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg="primary" pill className="fs-6">
                {assessmentTypes.length}{" "}
                {assessmentTypes.length === 1 ? "Metric" : "Metrics"}
              </Badge>

              {/* View Toggle */}
              <ButtonGroup className="view-toggle-group">
                <ToggleButton
                  id="table-view"
                  type="radio"
                  variant={viewMode === "table" ? "primary" : "outline-primary"}
                  name="viewMode"
                  value="table"
                  checked={viewMode === "table"}
                  onChange={handleViewModeChange}
                  className="d-flex align-items-center gap-1"
                >
                  <FaTable />
                  Table
                </ToggleButton>
                <ToggleButton
                  id="card-view"
                  type="radio"
                  variant={viewMode === "cards" ? "primary" : "outline-primary"}
                  name="viewMode"
                  value="cards"
                  checked={viewMode === "cards"}
                  onChange={handleViewModeChange}
                  className="d-flex align-items-center gap-1"
                >
                  <FaTh />
                  Cards
                </ToggleButton>
              </ButtonGroup>

              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <FaPlus />
                Add Metric
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {deleteError && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant="danger"
              dismissible
              onClose={() => setDeleteError("")}
            >
              <Alert.Heading>Delete Error</Alert.Heading>
              {deleteError}
            </Alert>
          </Col>
        </Row>
      )}

      {assessmentTypes.length === 0 ? (
        <Row>
          <Col>
            <div className="alert alert-info text-center" role="alert">
              <h4 className="alert-heading">No Metrics Found</h4>
              <p className="mb-0">
                Start by adding your first assessment metric.
              </p>
            </div>
          </Col>
        </Row>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}

      <AddMetricModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onMetricAdded={handleAddMetric}
        apiService={apiService}
        existingCategories={
          [
            ...new Set(
              assessmentTypes
                .map((m: Metric) => m.category || m.Category)
                .filter(Boolean)
            ),
          ] as string[]
        }
      />

      <EditMetricModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onMetricUpdated={handleUpdateMetric}
        metric={selectedMetric}
        apiService={apiService}
        existingCategories={
          [
            ...new Set(
              assessmentTypes
                .map((m: Metric) => m.category || m.Category)
                .filter(Boolean)
            ),
          ] as string[]
        }
      />
    </Container>
  );
};

export default MetricsPage;
