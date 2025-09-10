import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AddMetricModal = ({ 
  show, 
  onHide, 
  onMetricAdded, 
  apiService, 
  existingCategories = [] 
}) => {
  const [formData, setFormData] = useState({
    assessment_type: '',
    category: '',
    assessment_type_sort: '',
    category_sort: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setFormData({
      assessment_type: '',
      category: '',
      assessment_type_sort: '',
      category_sort: ''
    });
    setError('');
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.assessment_type.trim()) {
        throw new Error('Assessment type name is required');
      }
      
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }

      const submitData = {
        assessment_type: formData.assessment_type.trim(),
        category: formData.category.trim(),
        assessment_type_sort: formData.assessment_type_sort ? parseInt(formData.assessment_type_sort) : undefined,
        category_sort: formData.category_sort ? parseInt(formData.category_sort) : undefined
      };

      const response = await apiService.createAssessmentType(submitData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create metric');
      }
      onMetricAdded(response.data);

      handleClose();
    } catch (error) {
      console.error('Error creating metric:', error);
      setError(error.message || 'Failed to create metric');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Assessment Metric</Modal.Title>
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
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Metric'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddMetricModal;
