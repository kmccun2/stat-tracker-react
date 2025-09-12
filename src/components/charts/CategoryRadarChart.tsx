import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Type definitions
interface Player {
  id: number;
  Name: string;
}

interface AssessmentType {
  AssessmentType: string;
  Category: string;
}

interface CategoryRadarChartProps {
  player: Player;
  assessmentResults: Record<string, any>;
  assessmentTypes: AssessmentType[];
  findGoal: (player: Player, assessmentType: string) => any;
  isGoalMet: (player: Player, assessmentType: string, result: any) => boolean | null;
}

const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({
  player,
  assessmentResults,
  assessmentTypes,
  isGoalMet,
}) => {
  // Group assessments by category and calculate average performance
  const categories = [...new Set(assessmentTypes.map(a => a.Category))];

  const categoryData = categories.map(category => {
    const categoryAssessments = assessmentTypes.filter(a => a.Category === category);
    const results = categoryAssessments
      .map(assessment => {
        const result = assessmentResults[`${player.id}-${assessment.AssessmentType}`];
        if (!result) return null;

        const goalMet = isGoalMet(player, assessment.AssessmentType, result);
        return goalMet !== null ? (goalMet ? 100 : 50) : null; // 100 for met, 50 for not met, null for no goal
      })
      .filter(r => r !== null) as number[];

    if (results.length === 0) return 0;
    return results.reduce((sum, r) => sum + r, 0) / results.length;
  });

  const hasData = categoryData.some(value => value > 0);

  if (!hasData) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <p className="mb-0">No assessment data available</p>
            <small>Enter assessment results to see category performance</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: `${player.Name}'s Performance`,
        data: categoryData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `${player.Name}'s Category Performance Radar`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.r.toFixed(1)}% goal achievement`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          callback: function (value: any) {
            return value + '%';
          },
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div style={{ height: '400px' }}>
          <Radar data={chartData} options={options} />
        </div>
        <div className="mt-3 text-center">
          <small className="text-muted">
            <strong>Performance Scale:</strong>
            <span className="ms-2">100% = All Goals Met</span>
            <span className="ms-2">50% = Goals Not Met</span>
            <span className="ms-2">0% = No Data</span>
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategoryRadarChart;
