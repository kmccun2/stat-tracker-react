import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import {
  FaBullseye,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaUpload,
  FaInfoCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import apiService from "../../../services/apiService";

// Type definitions
interface Goal {
  id: number;
  assessment_type: string;
  unit: string;
  age_range: string;
  gender: string;
  low_is_good: number;
  is_range_goal: number;
  score_low_end: number | null;
  score_high_end: number | null;
  score_average: number | null;
}

interface AssessmentType {
  assessment_type: string;
}

interface FormData {
  assessmentType: string;
  unit: string;
  ageRange: string;
  gender: string;
  lowIsGood: boolean;
  isRangeGoal: boolean;
  scoreLowEnd: string;
  scoreHighEnd: string;
  scoreAverage: string;
}

interface Filters {
  assessmentType: string;
  ageRange: string;
  gender: string;
}

const GoalsPageNew: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filters, setFilters] = useState<Filters>({
    assessmentType: "",
    ageRange: "",
    gender: "",
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    assessmentType: "",
    unit: "",
    ageRange: "",
    gender: "",
    lowIsGood: false,
    isRangeGoal: false,
    scoreLowEnd: "",
    scoreHighEnd: "",
    scoreAverage: "",
  });

  const ageRanges = ["12 or less", "13-14", "15-16", "17-18", "18+"];
  const genders = ["M", "F"];

  useEffect(() => {
    loadGoals();
    loadAssessmentTypes();
  }, []);

  const loadGoals = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.request("/goals");
      setGoals(response.data);
    } catch (err: any) {
      setError("Failed to load goals");
      console.error("Error loading goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssessmentTypes = async (): Promise<void> => {
    try {
      // This endpoint might need to be created or we can extract from goals
      const response = await apiService.request("/assessment-types");
      setAssessmentTypes(response.data);
    } catch (err: any) {
      console.error("Error loading assessment types:", err);
      // For now, extract unique assessment types from goals
      if (goals.length > 0) {
        const uniqueTypes = [...new Set(goals.map((g) => g.assessment_type))];
        setAssessmentTypes(
          uniqueTypes.map((type) => ({ assessment_type: type }))
        );
      }
    }
  };

  const handleShowModal = (goal: Goal | null = null): void => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        assessmentType: goal.assessment_type,
        unit: goal.unit,
        ageRange: goal.age_range,
        gender: goal.gender,
        lowIsGood: goal.low_is_good === 1,
        isRangeGoal: goal.is_range_goal === 1,
        scoreLowEnd: goal.score_low_end?.toString() || "",
        scoreHighEnd: goal.score_high_end?.toString() || "",
        scoreAverage: goal.score_average?.toString() || "",
      });
    } else {
      setEditingGoal(null);
      setFormData({
        assessmentType: "",
        unit: "",
        ageRange: "",
        gender: "",
        lowIsGood: false,
        isRangeGoal: false,
        scoreLowEnd: "",
        scoreHighEnd: "",
        scoreAverage: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setEditingGoal(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        scoreLowEnd: formData.scoreLowEnd
          ? parseFloat(formData.scoreLowEnd)
          : null,
        scoreHighEnd: formData.scoreHighEnd
          ? parseFloat(formData.scoreHighEnd)
          : null,
        scoreAverage: formData.scoreAverage
          ? parseFloat(formData.scoreAverage)
          : null,
      };

      if (editingGoal) {
        await apiService.request(`/goals/${editingGoal.id}`, {
          method: "PUT",
          body: JSON.stringify(submitData),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await apiService.request("/goals", {
          method: "POST",
          body: JSON.stringify(submitData),
          headers: { "Content-Type": "application/json" },
        });
      }

      await loadGoals();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save goal");
      console.error("Error saving goal:", err);
    }
  };

  const handleDelete = async (goalId: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await apiService.request(`/goals/${goalId}`, {
          method: "DELETE",
        });
        await loadGoals();
      } catch (err: any) {
        setError("Failed to delete goal");
        console.error("Error deleting goal:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredGoals = goals.filter((goal) => {
    return (
      (!filters.assessmentType ||
        goal.assessment_type.includes(filters.assessmentType)) &&
      (!filters.ageRange || goal.age_range === filters.ageRange) &&
      (!filters.gender || goal.gender === filters.gender)
    );
  });

  const getGoalStatusBadge = (goal: Goal): JSX.Element => {
    const hasScoring =
      goal.score_low_end !== null &&
      goal.score_high_end !== null &&
      goal.score_average !== null;
    if (hasScoring) {
      return <Badge bg="success">Configured</Badge>;
    }
    return <Badge bg="warning">Not Configured</Badge>;
  };

  const getGoalTypeDescription = (goal: Goal): string => {
    let description = goal.low_is_good ? "Lower is Better" : "Higher is Better";
    if (goal.is_range_goal) {
      description += " (Range Goal)";
    }
    return description;
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaBullseye /> Goals Management
              </h2>
              <p className="text-muted mb-0">
                Configure scoring parameters for each metric by gender and age
                range
              </p>
            </div>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FaPlus className="me-1" /> Add Goal
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <FaFilter className="text-muted" />
                  <span className="fw-bold">Filters:</span>
                </div>

                <Form.Group className="mb-0">
                  <Form.Select
                    size="sm"
                    name="assessmentType"
                    value={filters.assessmentType}
                    onChange={handleFilterChange}
                    style={{ width: "200px" }}
                  >
                    <option value="">All Assessment Types</option>
                    {assessmentTypes.map((type) => (
                      <option
                        key={type.assessment_type}
                        value={type.assessment_type}
                      >
                        {type.assessment_type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Select
                    size="sm"
                    name="ageRange"
                    value={filters.ageRange}
                    onChange={handleFilterChange}
                    style={{ width: "150px" }}
                  >
                    <option value="">All Age Ranges</option>
                    {ageRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Select
                    size="sm"
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    style={{ width: "120px" }}
                  >
                    <option value="">All Genders</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </Form.Select>
                </Form.Group>

                {(filters.assessmentType ||
                  filters.ageRange ||
                  filters.gender) && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        assessmentType: "",
                        ageRange: "",
                        gender: "",
                      })
                    }
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Goals Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  Goals Configuration ({filteredGoals.length} records)
                </span>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                  >
                    <FaDownload className="me-1" /> Export
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <FaUpload className="me-1" /> Import
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <Table striped hover responsive>
                  <thead className="bg-light sticky-top">
                    <tr>
                      <th>Assessment Type</th>
                      <th>Age Range</th>
                      <th>Gender</th>
                      <th>Goal Type</th>
                      <th>Score Range</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGoals.map((goal) => (
                      <tr key={goal.id}>
                        <td>
                          <strong>{goal.assessment_type}</strong>
                          <br />
                          <small className="text-muted">{goal.unit}</small>
                        </td>
                        <td>
                          <Badge bg="secondary">{goal.age_range}</Badge>
                        </td>
                        <td>
                          <Badge bg={goal.gender === "M" ? "primary" : "info"}>
                            {goal.gender === "M" ? "Male" : "Female"}
                          </Badge>
                        </td>
                        <td>
                          <small>{getGoalTypeDescription(goal)}</small>
                        </td>
                        <td>
                          {goal.score_low_end !== null &&
                          goal.score_high_end !== null &&
                          goal.score_average !== null ? (
                            <div>
                              <small>
                                Low (0): {goal.score_low_end}
                                <br />
                                Avg (75): {goal.score_average}
                                <br />
                                High (100): {goal.score_high_end}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Not configured</span>
                          )}
                        </td>
                        <td>{getGoalStatusBadge(goal)}</td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-primary"
                              onClick={() => handleShowModal(goal)}
                              title="Edit Goal"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDelete(goal.id)}
                              title="Delete Goal"
                            >
                              <FaTrash />
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {filteredGoals.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No goals found</p>
                  <small className="text-muted">
                    Add some goals to get started
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Goal Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGoal ? "Edit Goal" : "Add New Goal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assessment Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="assessmentType"
                    value={formData.assessmentType}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g., seconds, mph, points"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Age Range</Form.Label>
                  <Form.Select
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Age Range</option>
                    {ageRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="lowIsGood"
                    checked={formData.lowIsGood}
                    onChange={handleInputChange}
                    label="Lower values are better"
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h6 className="mb-3">Scoring Configuration</h6>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Low End Score (0 points)</Form.Label>
                  <Form.Control
                    type="number"
                    name="scoreLowEnd"
                    value={formData.scoreLowEnd}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Worst performance value"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Average Score (75 points)</Form.Label>
                  <Form.Control
                    type="number"
                    name="scoreAverage"
                    value={formData.scoreAverage}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Average performance value"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>High End Score (100 points)</Form.Label>
                  <Form.Control
                    type="number"
                    name="scoreHighEnd"
                    value={formData.scoreHighEnd}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Best performance value"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                <FaTimes className="me-1" />
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                {editingGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GoalsPageNew;
