import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Format?: string;
}

interface PlayerResult {
  assessmentType: string;
  category: string;
  value: number | null;
  unit: string;
}

interface PlayerProgressChartProps {
  player: Player;
  assessmentResults: Record<string, any>;
  assessmentTypes: AssessmentType[];
  goals: any[];
  type?: 'line' | 'bar';
}

const PlayerProgressChart: React.FC<PlayerProgressChartProps> = ({
  player,
  assessmentResults,
  assessmentTypes,
  type = 'line',
}) => {
  // Get assessment results for this player
  const playerResults: PlayerResult[] = assessmentTypes
    .map(assessment => {
      const result = assessmentResults[`${player.id}-${assessment.AssessmentType}`];
      return {
        assessmentType: assessment.AssessmentType,
        category: assessment.Category,
        value: result ? parseFloat(result) : null,
        unit: assessment.Format || '',
      };
    })
    .filter(result => result.value !== null);

  if (playerResults.length === 0) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <p className="mb-0">No assessment data available</p>
            <small>Enter some assessment results to see progress charts</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  // Group by category for better visualization
  const categories = [...new Set(playerResults.map(r => r.category))];
  const categoryColors: Record<string, string> = {
    General: '#6c757d',
    Hitting: '#dc3545',
    Throwing: '#fd7e14',
    Strength: '#6f42c1',
    Speed: '#198754',
    Power: '#0d6efd',
  };

  const chartData = {
    labels: playerResults.map(r => r.assessmentType),
    datasets: categories
      .map(category => ({
        label: category,
        data: playerResults.map(r => (r.category === category ? r.value : null)),
        borderColor: categoryColors[category] || '#6c757d',
        backgroundColor: (categoryColors[category] || '#6c757d') + '20',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        spanGaps: false,
      }))
      .filter(dataset => dataset.data.some(val => val !== null)),
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
        text: `${player.Name}'s Assessment Results`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const result = playerResults.find(r => r.assessmentType === context.label);
            return `${context.dataset.label}: ${context.parsed.y}${result?.unit || ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Performance Value',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Assessment Type',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <Card className="h-100">
      <Card.Body>
        <div style={{ height: '400px' }}>
          <ChartComponent data={chartData} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlayerProgressChart;
