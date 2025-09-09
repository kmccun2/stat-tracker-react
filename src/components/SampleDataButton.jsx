import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaFlask, FaRandom } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const SampleDataButton = ({ player }) => {
  const { assessmentTypes, updateAssessmentResult, findGoal } = useData();

  const addSampleData = () => {
    // Add realistic sample data for testing charts
    const sampleValues = {
      // Hitting
      'Exit Velocity': Math.floor(Math.random() * 20) + 75, // 75-95 mph
      'Batting Average': (Math.random() * 0.2 + 0.25).toFixed(3), // .250-.450
      'On Base Percentage': (Math.random() * 0.15 + 0.3).toFixed(3), // .300-.450
      
      // Throwing
      'Throwing Velocity': Math.floor(Math.random() * 15) + 70, // 70-85 mph
      'Pop Time': (Math.random() * 0.3 + 1.8).toFixed(2), // 1.8-2.1 seconds
      
      // Speed
      '60 Yard Dash': (Math.random() * 1.0 + 6.5).toFixed(2), // 6.5-7.5 seconds
      '10 Yard Split': (Math.random() * 0.3 + 1.5).toFixed(2), // 1.5-1.8 seconds
      
      // Strength
      'Bench Press': Math.floor(Math.random() * 50) + 150, // 150-200 lbs
      'Squat': Math.floor(Math.random() * 80) + 200, // 200-280 lbs
      'Deadlift': Math.floor(Math.random() * 100) + 250, // 250-350 lbs
      
      // Power
      'Vertical Jump': Math.floor(Math.random() * 8) + 28, // 28-36 inches
      'Broad Jump': Math.floor(Math.random() * 12) + 96, // 96-108 inches
      
      // General
      'Height': Math.floor(Math.random() * 6) + 70, // 70-76 inches
      'Weight': Math.floor(Math.random() * 40) + 160, // 160-200 lbs
      'Body Fat %': (Math.random() * 5 + 8).toFixed(1), // 8-13%
    };

    // Add sample data for available assessments
    assessmentTypes.forEach(assessment => {
      const assessmentType = assessment.AssessmentType;
      if (sampleValues[assessmentType]) {
        updateAssessmentResult(player.id, assessmentType, sampleValues[assessmentType]);
      } else {
        // Generate a random value based on the goal if available
        const goalInfo = findGoal(player, assessmentType);
        if (goalInfo && goalInfo.goal) {
          const goal = parseFloat(goalInfo.goal);
          const variation = goal * 0.2; // 20% variation
          const randomValue = (goal + (Math.random() - 0.5) * 2 * variation).toFixed(2);
          updateAssessmentResult(player.id, assessmentType, randomValue);
        }
      }
    });
  };

  return (
    <div className="mb-3">
      <Alert variant="info" className="d-flex align-items-center justify-content-between">
        <div>
          <strong><FaFlask className="me-2" />Testing Mode:</strong> 
          <span className="ms-2">Add sample assessment data to test the chart functionality</span>
        </div>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={addSampleData}
          className="d-flex align-items-center gap-2"
        >
          <FaRandom /> Add Sample Data
        </Button>
      </Alert>
    </div>
  );
};

export default SampleDataButton;
