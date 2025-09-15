import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Metric, Category } from "@/types/metric";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";

// Types
interface AddMetricModalProps {
  show: boolean;
  onClose: () => void;
  setMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
}

interface MetricFormData {
  metric?: string;
  description?: string;
  categoryId?: number;
}

/**
 * AddMetricModal Component
 * Modal form for adding new metrics to the assessment system
 */
const AddMetricModal: React.FC<AddMetricModalProps> = ({
  show,
  onClose,
  setMetrics,
}) => {
  // State management
  const [formData, setFormData] = useState<MetricFormData>({
    metric: "",
    description: "",
    categoryId: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Hooks
  const { getAllMetrics, getCategories, addMetric } = useAPI();
  const dispatch = useAppDispatch();

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.metric?.trim()) {
      errors.metric = "Metric name is required";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.categoryId) {
      errors.category = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Toast notifications
  const showSuccessToast = (message: string) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title: "Success",
        message,
        type: "success",
      } as ToastItemType)
    );
  };

  const showErrorToast = (message: string) => {
    dispatch(
      addToastItem({
        id: Date.now().toString(),
        title: "Error Adding Metric",
        message,
        type: "error",
      } as ToastItemType)
    );
  };

  // Data fetching
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoryId: parseInt(value) || undefined,
    }));

    // Clear category error when user selects a category
    if (formErrors.category) {
      setFormErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const metricData = {
        metric: formData.metric!.trim(),
        description: formData.description!.trim(),
        categoryId: formData.categoryId!,
        isActive: true,
      };

      await addMetric(metricData);

      // Refresh metrics list
      const updatedMetrics = await getAllMetrics();
      setMetrics(updatedMetrics);

      showSuccessToast(`Metric "${metricData.metric}" added successfully!`);
      handleClose();
    } catch (error) {
      console.error("Error adding metric:", error);
      showErrorToast("Failed to add metric. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      metric: "",
      description: "",
      categoryId: undefined,
    });
    setFormErrors({});
    onClose();
  };

  // Effects
  useEffect(() => {
    if (show) {
      fetchCategories();
    }
  }, [show]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Metric</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Metric Name */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="metric">Metric Name *</Form.Label>
            <Form.Control
              type="text"
              id="metric"
              name="metric"
              value={formData.metric || ""}
              onChange={handleInputChange}
              placeholder="e.g., Exit Velocity - Tee"
              disabled={loading}
              isInvalid={!!formErrors.metric}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.metric}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Metric Description */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="description">Metric Description *</Form.Label>
            <Form.Control
              as="textarea"
              id="description"
              name="description"
              maxLength={65}
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Enter a description for this metric"
              rows={3}
              disabled={loading}
              isInvalid={!!formErrors.description}
            />
            <div className="d-flex justify-content-between">
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
              <small className="text-muted">
                {(formData.description || "").length}/65 characters
              </small>
            </div>
          </Form.Group>

          {/* Category */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="categoryId">Category *</Form.Label>
            <Form.Select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleCategoryChange}
              disabled={loading}
              isInvalid={!!formErrors.category}
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={cat.category} value={index + 1}>
                  {cat.category}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.category}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Metric"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddMetricModal;
