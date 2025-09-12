import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Form,
} from "react-bootstrap";
import { FaClipboardList, FaArrowLeft, FaPlay, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";

// Type definitions
interface AssessmentType {
  assessment_type: string;
  category: string;
  format?: string;
  style?: string;
}

type CategoryFilterType = "all" | string;

const AssessmentSelectionPage: React.FC = () => {
  const { apiService } = useData();
  const navigate = useNavigate();
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterType>("all");

  useEffect(() => {
    fetchAssessmentTypes();
  }, []);

  const fetchAssessmentTypes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getMetrics();
      if (response.success) {
        setAssessmentTypes(response.data);
      } else {
        throw new Error("Failed to fetch assessment types");
      }
    } catch (err) {
      console.error("Error fetching assessment types:", err);
      setError("Failed to load assessment types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCategories = (): string[] => {
    const categories = [
      ...new Set(assessmentTypes.map((type) => type.category)),
    ];
    return categories.filter((category) => category).sort();
  };

  const getFilteredAssessmentTypes = (): AssessmentType[] => {
    if (categoryFilter === "all") {
      return assessmentTypes;
    }
    return assessmentTypes.filter((type) => type.category === categoryFilter);
  };

  const getCategoryBadgeColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Hitting: "primary",
      Pitching: "success",
      Fielding: "info",
      Speed: "warning",
      Strength: "danger",
      Mental: "secondary",
    };
    return colors[category] || "light";
  };

  const handleSelectAssessmentType = (assessmentType: AssessmentType): void => {
    setSelectedType(assessmentType);
  };

  const handleStartAssessment = (): void => {
    if (selectedType) {
      // Navigate to assessment form or next step with selected type
      // For now, we'll just show an alert - you can modify this to navigate to your assessment form
      alert(`Starting assessment: ${selectedType.assessment_type}`);
      // Example: navigate(`/assessment/new?type=${selectedType.assessment_type}`);
    }
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading assessment types...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Button
              variant="outline-secondary"
              onClick={handleGoBack}
              className="d-flex align-items-center gap-2"
            >
              <FaArrowLeft />
              Back
            </Button>
            <div className="d-flex align-items-center gap-2">
              <FaClipboardList className="text-primary" size={24} />
              <h2 className="mb-0">Select Assessment Type</h2>
            </div>
          </div>
          <p className="text-muted">
            Choose the type of assessment you want to perform
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Category Filter */}
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaFilter className="text-muted" />
            <label className="form-label mb-0">Filter by Category</label>
          </div>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Assessment Types Grid */}
      <Row className="mb-4">
        {getFilteredAssessmentTypes().length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FaClipboardList className="text-muted mb-3" size={48} />
                <h5 className="text-muted">No assessment types found</h5>
                <p className="text-muted">
                  {categoryFilter !== "all"
                    ? `No assessment types available in the ${categoryFilter} category.`
                    : "No assessment types have been configured."}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          getFilteredAssessmentTypes().map(
            (type: AssessmentType, index: number) => (
              <Col
                key={type.assessment_type}
                xs={12}
                sm={6}
                lg={4}
                xl={3}
                className="mb-3"
              >
                <Card
                  className={`h-100 ${
                    selectedType?.assessment_type === type.assessment_type
                      ? "border-primary shadow"
                      : "border-0"
                  }`}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => handleSelectAssessmentType(type)}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg={getCategoryBadgeColor(type.category)}>
                        {type.category}
                      </Badge>
                      {selectedType?.assessment_type ===
                        type.assessment_type && (
                        <Badge bg="primary">Selected</Badge>
                      )}
                    </div>

                    <h6 className="card-title">{type.assessment_type}</h6>

                    <div className="mt-auto">
                      <small className="text-muted">
                        Format: {type.format || "Standard"}
                      </small>
                      {type.style && (
                        <div>
                          <small className="text-muted">
                            Style: {type.style}
                          </small>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          )
        )}
      </Row>

      {/* Selected Assessment Info and Start Button */}
      {selectedType && (
        <Row>
          <Col>
            <Card className="border-primary shadow">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">Selected Assessment</h6>
              </Card.Header>
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-2">{selectedType.assessment_type}</h5>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <Badge bg={getCategoryBadgeColor(selectedType.category)}>
                        {selectedType.category}
                      </Badge>
                      <span className="text-muted">
                        Format: {selectedType.format || "Standard"}
                      </span>
                      {selectedType.style && (
                        <span className="text-muted">
                          Style: {selectedType.style}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartAssessment}
                      className="d-flex align-items-center gap-2"
                    >
                      <FaPlay />
                      Start Assessment
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AssessmentSelectionPage;
