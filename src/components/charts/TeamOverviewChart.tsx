// React library for component creation
import React from "react";

// Chart.js components and configuration for data visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// React Chart.js 2 chart components
import { Bar, Doughnut } from "react-chartjs-2";

// React Bootstrap UI components for layout
import { Card, Row, Col } from "react-bootstrap";

// Register Chart.js components for use in charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Player interface for chart data processing
 * Note: This should ideally be imported from a shared types file
 */
interface Player {
  id: number;
  Name: string;
}

interface AssessmentType {
  AssessmentType: string;
  Category: string;
}

interface CategoryStat {
  total: number;
  met: number;
  notEntered: number;
}

interface TeamOverviewChartProps {
  players: Player[];
  assessmentResults: Record<string, any>;
  assessmentTypes: AssessmentType[];
  goals: any[];
  findGoal: (playerId: number, assessmentType: string) => any;
  isGoalMet: (player: Player, assessmentType: string, result: any) => boolean;
}

const TeamOverviewChart: React.FC<TeamOverviewChartProps> = ({
  players,
  assessmentResults,
  assessmentTypes,
  goals,
  findGoal,
  isGoalMet,
}) => {
  // Calculate goal achievement rates by category
  const categoryStats: Record<string, CategoryStat> = assessmentTypes.reduce(
    (acc, assessment) => {
      const category = assessment.Category;
      if (!acc[category]) {
        acc[category] = { total: 0, met: 0, notEntered: 0 };
      }

      players.forEach((player) => {
        const result =
          assessmentResults[`${player.id}-${assessment.AssessmentType}`];
        acc[category].total++;

        if (!result || result === "") {
          acc[category].notEntered++;
        } else {
          const goalMet = isGoalMet(player, assessment.AssessmentType, result);
          if (goalMet) {
            acc[category].met++;
          }
        }
      });

      return acc;
    },
    {} as Record<string, CategoryStat>
  );

  // Calculate overall team stats
  const totalAssessments = players.length * assessmentTypes.length;
  const totalEntered = Object.values(assessmentResults).filter(
    (result) => result && result !== ""
  ).length;
  const totalGoalsMet = players.reduce((total, player) => {
    return (
      total +
      assessmentTypes.reduce((playerTotal, assessment) => {
        const result =
          assessmentResults[`${player.id}-${assessment.AssessmentType}`];
        if (result && result !== "") {
          const goalMet = isGoalMet(player, assessment.AssessmentType, result);
          return playerTotal + (goalMet ? 1 : 0);
        }
        return playerTotal;
      }, 0)
    );
  }, 0);

  // Goal Achievement by Category Chart
  const categoryChartData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: "Goals Met",
        data: Object.values(categoryStats).map((stat) =>
          stat.total - stat.notEntered > 0
            ? parseFloat(
                ((stat.met / (stat.total - stat.notEntered)) * 100).toFixed(1)
              )
            : 0
        ),
        backgroundColor: "#198754",
        borderColor: "#198754",
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Goal Achievement Rate by Category (%)",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const category = context.label;
            const stats = categoryStats[category];
            const rate = context.parsed.y;
            return [
              `Achievement Rate: ${rate}%`,
              `Goals Met: ${stats.met}`,
              `Total Entered: ${stats.total - stats.notEntered}`,
              `Not Entered: ${stats.notEntered}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Achievement Rate (%)",
        },
      },
    },
  };

  // Overall Progress Doughnut Chart
  const progressData = {
    labels: ["Goals Met", "Goals Not Met", "Not Entered"],
    datasets: [
      {
        data: [
          totalGoalsMet,
          totalEntered - totalGoalsMet,
          totalAssessments - totalEntered,
        ],
        backgroundColor: ["#198754", "#dc3545", "#6c757d"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const progressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Overall Team Progress",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const percentage = ((value / totalAssessments) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Player Completion Stats
  const playerCompletionData = {
    labels: players.map((p) => p.Name),
    datasets: [
      {
        label: "Assessments Completed",
        data: players.map((player) => {
          return assessmentTypes.filter((assessment) => {
            const result =
              assessmentResults[`${player.id}-${assessment.AssessmentType}`];
            return result && result !== "";
          }).length;
        }),
        backgroundColor: "#0d6efd",
        borderColor: "#0d6efd",
        borderWidth: 1,
      },
    ],
  };

  const playerCompletionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Assessment Completion by Player",
        font: {
          size: 14,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: assessmentTypes.length,
        title: {
          display: true,
          text: "Assessments Completed",
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <Row>
      <Col lg={6} className="mb-4">
        <Card className="h-100">
          <Card.Body>
            <div style={{ height: "300px" }}>
              <Bar data={categoryChartData} options={categoryChartOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6} className="mb-4">
        <Card className="h-100">
          <Card.Body>
            <div style={{ height: "300px" }}>
              <Doughnut data={progressData} options={progressOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={12} className="mb-4">
        <Card className="h-100">
          <Card.Body>
            <div style={{ height: "350px" }}>
              <Bar
                data={playerCompletionData}
                options={playerCompletionOptions}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TeamOverviewChart;
