import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GoalComparisonChart = ({ player, assessmentResults, assessmentTypes, findGoal }) => {
  // Get assessment results with goals for this player
  const playerData = assessmentTypes.map(assessment => {
    const result = assessmentResults[`${player.id}-${assessment.AssessmentType}`];
    const goalInfo = findGoal(player, assessment.AssessmentType);
    
    if (!result || !goalInfo) return null;
    
    const resultValue = parseFloat(result);
    let goalValue = null;
    let goalType = '';
    
    // Determine which goal to use
    if (goalInfo.minGoal && goalInfo.maxGoal) {
      goalValue = (parseFloat(goalInfo.minGoal) + parseFloat(goalInfo.maxGoal)) / 2;
      goalType = 'Range Target';
    } else if (goalInfo.goal) {
      goalValue = parseFloat(goalInfo.goal);
      goalType = goalInfo.lowIsGood ? 'Maximum' : 'Minimum';
    }
    
    return {
      assessmentType: assessment.AssessmentType,
      category: assessment.Category,
      result: resultValue,
      goal: goalValue,
      goalType,
      unit: goalInfo.unit || '',
      lowIsGood: goalInfo.lowIsGood
    };
  }).filter(item => item !== null);

  if (playerData.length === 0) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <p className="mb-0">No assessment data with goals available</p>
            <small>Enter assessment results to see goal comparisons</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const chartData = {
    labels: playerData.map(item => item.assessmentType),
    datasets: [
      {
        label: 'Current Result',
        data: playerData.map(item => item.result),
        backgroundColor: playerData.map(item => {
          // Color based on whether goal is met
          if (item.lowIsGood) {
            return item.result <= item.goal ? '#198754' : '#dc3545';
          } else {
            return item.result >= item.goal ? '#198754' : '#dc3545';
          }
        }),
        borderColor: playerData.map(item => {
          if (item.lowIsGood) {
            return item.result <= item.goal ? '#198754' : '#dc3545';
          } else {
            return item.result >= item.goal ? '#198754' : '#dc3545';
          }
        }),
        borderWidth: 1,
      },
      {
        label: 'Goal Target',
        data: playerData.map(item => item.goal),
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
        borderWidth: 1,
        type: 'line',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      title: {
        display: true,
        text: `${player.Name}'s Performance vs Goals`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const item = playerData[context.dataIndex];
            if (context.datasetIndex === 0) {
              const status = item.lowIsGood 
                ? (item.result <= item.goal ? '✅ Goal Met' : '❌ Above Goal')
                : (item.result >= item.goal ? '✅ Goal Met' : '❌ Below Goal');
              return `Current: ${context.parsed.y}${item.unit} (${status})`;
            } else {
              return `Goal (${item.goalType}): ${context.parsed.y}${item.unit}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Performance Value'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Assessment Type'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div style={{ height: '400px' }}>
          <Bar data={chartData} options={options} />
        </div>
        <div className="mt-3">
          <small className="text-muted">
            <strong>Legend:</strong> 
            <span className="ms-2">🟢 Goal Met</span>
            <span className="ms-2">🔴 Goal Not Met</span>
            <span className="ms-2">🟡 Goal Target</span>
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GoalComparisonChart;
