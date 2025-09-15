import { useState, useEffect } from "react";

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
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{
        backgroundColor: show ? "rgba(0, 0, 0, 0.5)" : "transparent",
      }}
      tabIndex={-1}
      aria-labelledby="addPlayerModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Metric</h4>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Metric Name */}
                <div className="mb-3">
                  <label htmlFor="metric" className="form-label">
                    Metric Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.metric ? "is-invalid" : ""}`}
                    id="metric"
                    name="metric"
                    value={formData.metric || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Exit Velocity - Tee"
                    disabled={loading}
                  />
                  {formErrors.metric && (
                    <div className="invalid-feedback">{formErrors.metric}</div>
                  )}
                </div>

                {/* Metric Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Metric Description *
                  </label>
                  <textarea
                    className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Enter a description for this metric"
                    rows={3}
                    disabled={loading}
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">
                      {formErrors.description}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label htmlFor="categoryId" className="form-label">
                    Category *
                  </label>
                  <select
                    className={`form-control ${formErrors.category ? "is-invalid" : ""}`}
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId || ""}
                    onChange={handleCategoryChange}
                    disabled={loading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={cat.category} value={index + 1}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <div className="invalid-feedback">
                      {formErrors.category}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Metric"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMetricModal;
