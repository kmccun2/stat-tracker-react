import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { FaDownload, FaFileExport } from "react-icons/fa";
import { useData } from "../../context/DataContext";

// Type definitions for the component
interface Player {
  id: number;
  Name: string;
  age: number;
  Gender: "M" | "F";
}

interface AssessmentType {
  AssessmentType: string;
  Category?: string;
}

interface GoalInfo {
  minGoal?: number;
  maxGoal?: number;
  goal?: number;
  lowIsGood?: boolean;
  unit?: string;
}

interface ExportButtonProps {
  player?: Player;
}

const ExportButton: React.FC<ExportButtonProps> = ({ player }) => {
  const { assessmentTypes, getAssessmentResult, findGoal, isGoalMet, players } =
    useData();

  const exportPlayerData = (): void => {
    if (!player) return;

    const rows: string[][] = [];

    // Header
    rows.push([
      "Player Name",
      "Age",
      "Gender",
      "Assessment Type",
      "Category",
      "Goal",
      "Result",
      "Goal Met",
      "Unit",
    ]);

    // Data rows
    assessmentTypes.forEach((assessment: AssessmentType) => {
      const goalInfo = findGoal(
        player,
        assessment.AssessmentType
      ) as GoalInfo | null;
      const result = getAssessmentResult(player.id, assessment.AssessmentType);
      const goalMet = isGoalMet(player, assessment.AssessmentType, result);

      let goalText = "N/A";
      if (goalInfo) {
        if (goalInfo.minGoal && goalInfo.maxGoal) {
          goalText = `${goalInfo.minGoal}-${goalInfo.maxGoal}`;
        } else if (goalInfo.goal) {
          const operator = goalInfo.lowIsGood ? "≤" : "≥";
          goalText = `${operator} ${goalInfo.goal}`;
        }
      }

      rows.push([
        player.Name,
        player.age.toString(),
        player.Gender,
        assessment.AssessmentType,
        assessment.Category || "Other",
        goalText,
        result?.toString() || "",
        goalMet === null ? "" : goalMet ? "Yes" : "No",
        goalInfo?.unit || "",
      ]);
    });

    // Convert to CSV
    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${player.Name.replace(/[^a-z0-9]/gi, "_")}_results.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllData = (): void => {
    const rows: string[][] = [];

    // Header
    rows.push([
      "Player Name",
      "Age",
      "Gender",
      "Assessment Type",
      "Category",
      "Goal",
      "Result",
      "Goal Met",
      "Unit",
    ]);

    // Data rows for all players
    players.forEach((p: Player) => {
      assessmentTypes.forEach((assessment: AssessmentType) => {
        const goalInfo = findGoal(
          p,
          assessment.AssessmentType
        ) as GoalInfo | null;
        const result = getAssessmentResult(p.id, assessment.AssessmentType);
        const goalMet = isGoalMet(p, assessment.AssessmentType, result);

        let goalText = "N/A";
        if (goalInfo) {
          if (goalInfo.minGoal && goalInfo.maxGoal) {
            goalText = `${goalInfo.minGoal}-${goalInfo.maxGoal}`;
          } else if (goalInfo.goal) {
            const operator = goalInfo.lowIsGood ? "≤" : "≥";
            goalText = `${operator} ${goalInfo.goal}`;
          }
        }

        rows.push([
          p.Name,
          p.age.toString(),
          p.Gender,
          assessment.AssessmentType,
          assessment.Category || "Other",
          goalText,
          result?.toString() || "",
          goalMet === null ? "" : goalMet ? "Yes" : "No",
          goalInfo?.unit || "",
        ]);
      });
    });

    // Convert to CSV
    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "all_players_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ButtonGroup size="sm">
      {player && (
        <Button
          onClick={exportPlayerData}
          variant="outline-primary"
          className="d-flex align-items-center gap-2"
        >
          <FaDownload /> Export {player.Name}'s Results
        </Button>
      )}
      <Button
        onClick={exportAllData}
        variant="primary"
        className="d-flex align-items-center gap-2"
      >
        <FaFileExport /> Export All Results
      </Button>
    </ButtonGroup>
  );
};

export default ExportButton;
