import { useState, useEffect } from "react";

// Hooks & Services
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch } from "@/hooks/redux";

// Types & Utils
import { Metric, MetricCategory } from "@/types/metric";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";

// Types
interface AddMetricModalProps {
  show: boolean;
  onClose: () => void;
  setMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
}

interface MetricFormData {
  metric: string;
  category: string;
  metric_sort: number;
  category_sort: number;
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
    category: "",
    metric_sort: 1,
    category_sort: 1,
  });
  const [categories, setCategories] = useState<MetricCategory[]>([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Hooks
  const { getAllMetrics, getMetricCategories, addMetric } = useAPI();
  const dispatch = useAppDispatch();

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.metric.trim()) {
      errors.metric = "Metric name is required";
    }

    const categoryToUse = isCustomCategory ? customCategory : formData.category;
    if (!categoryToUse.trim()) {
      errors.category = "Category is required";
    }

    if (formData.metric_sort < 1) {
      errors.metric_sort = "Sort order must be at least 1";
    }

    if (formData.category_sort < 1) {
      errors.category_sort = "Category sort order must be at least 1";
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
      const fetchedCategories = await getMetricCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "metric_sort" || name === "category_sort") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
    if (value === "custom") {
      setIsCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      setCustomCategory("");
      const selectedCategory = categories.find((cat) => cat.category === value);
      setFormData((prev) => ({
        ...prev,
        category: value,
        category_sort: selectedCategory?.category_sort || 1,
      }));
    }
  };

  const handleCustomCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCategory(e.target.value);
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
      const categoryToUse = isCustomCategory
        ? customCategory
        : formData.category;
      const categorySort = isCustomCategory
        ? Math.max(...categories.map((c) => c.category_sort), 0) + 1
        : formData.category_sort;

      const metricData = {
        metric: formData.metric.trim(),
        category: categoryToUse.trim(),
        metric_sort: formData.metric_sort,
        category_sort: categorySort,
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
      category: "",
      metric_sort: 1,
      category_sort: 1,
    });
    setIsCustomCategory(false);
    setCustomCategory("");
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
                  value={formData.metric}
                  onChange={handleInputChange}
                  placeholder="e.g., Exit Velocity - Tee"
                  disabled={loading}
                />
                {formErrors.metric && (
                  <div className="invalid-feedback">{formErrors.metric}</div>
                )}
              </div>

              {/* Category */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  className={`form-control ${formErrors.category ? "is-invalid" : ""}`}
                  id="category"
                  value={isCustomCategory ? "custom" : formData.category}
                  onChange={handleCategoryChange}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                  <option value="custom">+ Add New Category</option>
                </select>
                {formErrors.category && (
                  <div className="invalid-feedback">{formErrors.category}</div>
                )}
              </div>

              {/* Custom Category Input */}
              {isCustomCategory && (
                <div className="mb-3">
                  <label htmlFor="customCategory" className="form-label">
                    New Category Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.category ? "is-invalid" : ""}`}
                    id="customCategory"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    placeholder="e.g., Hitting, Pitching, Fielding"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Metric Sort Order */}
              <div className="mb-3">
                <label htmlFor="metric_sort" className="form-label">
                  Metric Sort Order *
                </label>
                <input
                  type="number"
                  className={`form-control ${formErrors.metric_sort ? "is-invalid" : ""}`}
                  id="metric_sort"
                  name="metric_sort"
                  value={formData.metric_sort}
                  onChange={handleInputChange}
                  min="1"
                  disabled={loading}
                />
                {formErrors.metric_sort && (
                  <div className="invalid-feedback">
                    {formErrors.metric_sort}
                  </div>
                )}
                <div className="form-text">
                  Order this metric appears within its category
                </div>
              </div>

              {/* Category Sort Order (only show for existing categories) */}
              {!isCustomCategory && formData.category && (
                <div className="mb-3">
                  <label htmlFor="category_sort" className="form-label">
                    Category Sort Order *
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.category_sort ? "is-invalid" : ""}`}
                    id="category_sort"
                    name="category_sort"
                    value={formData.category_sort}
                    onChange={handleInputChange}
                    min="1"
                    disabled={loading}
                  />
                  {formErrors.category_sort && (
                    <div className="invalid-feedback">
                      {formErrors.category_sort}
                    </div>
                  )}
                  <div className="form-text">
                    Order this category appears in the metric list
                  </div>
                </div>
              )}
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
  );
};

export default AddMetricModal;
