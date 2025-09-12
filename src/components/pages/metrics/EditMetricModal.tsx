import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

// Type definitions
interface FormData {
  assessment_type: string;
  category: string;
  assessment_type_sort: string;
  category_sort: string;
}

interface Metric {
  id?: number;
  assessment_type?: string;
  AssessmentType?: string;
  category?: string;
  Category?: string;
  assessment_type_sort?: number;
  AssessmentTypeSort?: number;
  category_sort?: number;
  "Category Sort"?: number;
}

interface ApiResponse {
  success: boolean;
  data?: Metric;
  message?: string;
}

interface ApiService {
  updateAssessmentType: (
    id: number | undefined,
    data: any
  ) => Promise<ApiResponse>;
}

interface EditMetricModalProps {
  show: boolean;
  onHide: () => void;
  onMetricUpdated: (metric: Metric) => void;
  metric: Metric | null;
  apiService: ApiService;
  existingCategories?: string[];
}

const EditMetricModal: React.FC<EditMetricModalProps> = ({
  show,
  onHide,
  onMetricUpdated,
  metric,
  apiService,
  existingCategories = [],
}) => {
  const [formData, setFormData] = useState<FormData>({
    assessment_type: "",
    category: "",
    assessment_type_sort: "",
    category_sort: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (metric && show) {
      setFormData({
        assessment_type: metric.assessment_type || metric.AssessmentType || "",
        category: metric.category || metric.Category || "",
        assessment_type_sort: (
          metric.assessment_type_sort ||
          metric.AssessmentTypeSort ||
          ""
        ).toString(),
        category_sort: (
          metric.category_sort ||
          metric["Category Sort"] ||
          ""
        ).toString(),
      });
    }
  }, [metric, show]);

  const handleClose = (): void => {
    setFormData({
      assessment_type: "",
      category: "",
      assessment_type_sort: "",
      category_sort: "",
    });
    setError("");
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.assessment_type.trim()) {
        throw new Error("Assessment type name is required");
      }

      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }

      const submitData = {
        assessment_type: formData.assessment_type.trim(),
        category: formData.category.trim(),
        assessment_type_sort: formData.assessment_type_sort
          ? parseInt(formData.assessment_type_sort)
          : undefined,
        category_sort: formData.category_sort
          ? parseInt(formData.category_sort)
          : undefined,
      };

      const response = await apiService.updateAssessmentType(
        metric?.id,
        submitData
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to update metric");
      }

      if (response.data) {
        onMetricUpdated(response.data);
      }

      handleClose();
    } catch (error: any) {
      console.error("Error updating metric:", error);
      setError(error.message || "Failed to update metric");
    } finally {
      setIsLoading(false);
    }
  };

  if (!metric) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Assessment Metric</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Metric Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="assessment_type"
                  value={formData.assessment_type}
                  onChange={handleChange}
                  placeholder="e.g., Bench Press, 60 Yard Sprint"
                  required
                />
                <Form.Text className="text-muted">
                  The name of the assessment metric
                </Form.Text>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category...</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="General">General</option>
                  <option value="Hitting">Hitting</option>
                  <option value="Throwing">Throwing</option>
                  <option value="Strength">Strength</option>
                  <option value="Speed">Speed</option>
                  <option value="Power">Power</option>
                </Form.Control>
                <Form.Text className="text-muted">
                  Or type a new category name
                </Form.Text>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Assessment Sort Order</Form.Label>
                <Form.Control
                  type="number"
                  name="assessment_type_sort"
                  value={formData.assessment_type_sort}
                  onChange={handleChange}
                  placeholder="Auto-assigned if left blank"
                />
                <Form.Text className="text-muted">
                  Order within the category (optional)
                </Form.Text>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Category Sort Order</Form.Label>
                <Form.Control
                  type="number"
                  name="category_sort"
                  value={formData.category_sort}
                  onChange={handleChange}
                  placeholder="Auto-assigned if left blank"
                />
                <Form.Text className="text-muted">
                  Category display order (optional)
                </Form.Text>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Metric"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditMetricModal;
