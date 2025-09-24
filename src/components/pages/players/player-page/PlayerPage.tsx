import PageHeader from "@/components/common/page-header/PageHeader";
import LumexSpinner from "@/components/common/spinner/LumexSpinner";
import { useAPI } from "@/hooks/useAPI";
import { addToastItem, ToastItemType } from "@/slices/globalSlice";
import { PlayerProfile } from "@/types/player";
import { calculateAge } from "@/utils/ageCalculation";
import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AddPlayerModal from "../AddOrEditPlayerModals";

const groups = ["General", "Hitting", "Mobility", "Power", "Speed", "Strength", "Throwing"];

// Sample data for demonstration purposes. In a real app, this would be computed based on player assessments,
// goals per metric, and whether each metric meets/fails the goal or is not assessed.
// Assuming 33 unique metrics per group, with passed/failed/notAssessed summing to 33.
const sampleData = groups.map((group) => ({
  group,
  passed: Math.floor(Math.random() * 20) + 10, // Random for demo: 10-30
  failed: Math.floor(Math.random() * 10) + 1, // Random for demo: 1-11
  notAssessed: 33 - (Math.floor(Math.random() * 20) + 10) - (Math.floor(Math.random() * 10) + 1),
}));

// Sample player score data (mock data for demonstration)
const playerScoreData = {
  overallScore: 85,
  groupScores: groups.map((group) => ({
    group,
    score: Math.floor(Math.random() * (100 - 10 + 1)) + 10, // Random score between 10-100
  })),
};

const PlayerPage: React.FC = () => {
  // Player id from params
  const { playerId } = useParams<{ playerId: string }>();
  const { getPlayerById, deletePlayerById } = useAPI();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [player, setPlayer] = React.useState<PlayerProfile>();
  const [showEditPlayerModal, setShowEditPlayerModal] = React.useState<boolean>(false);

  // Event handlers
  const handleDeletePlayer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this player? This action cannot be undone.")) {
      // Call API to delete player
      await deletePlayerById(id);
      dispatch(
        addToastItem({
          id: Date.now().toString(),
          type: "success",
          title: "Player deleted!",
          message: "This player has successfully been deleted.",
        } as ToastItemType)
      );
      navigate("/players");
    }
  };

  // Hooks
  useEffect(() => {
    (async () => {
      if (!playerId) return;
      const _player = await getPlayerById(+playerId);
      setPlayer(_player);
    })();
  }, [playerId]);

  return player ? (
    <>
      <PageHeader
        title={player.firstName + " " + player.lastName}
        subtitle={`${calculateAge(player.dob)} years old`}
        actions={
          <div className="">
            <div className="lumex-btn primary circle me-1" onClick={() => setShowEditPlayerModal(true)}>
              <FaPencil size={18} />
            </div>
            <div className="lumex-btn danger circle" onClick={() => handleDeletePlayer(player.id!)}>
              <FaTrash size={18} />
            </div>
          </div>
        }
      />
      <div className="page-main-content row g-3">
        {/* Player Score Card */}
        <div className="reporting-card-wrapper col-xs-12 col-md-6">
          <div className="reporting-card">
            <h2 style={{ marginTop: 0 }}>Player Scores</h2>
            <p>
              <strong>Overall Score:</strong> {playerScoreData.overallScore}
            </p>
            <h3>Group Scores</h3>
            <ul>
              {playerScoreData.groupScores.map((groupScore) => (
                <li key={groupScore.group}>
                  {groupScore.group}: {groupScore.score}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reporting-card-wrapper col-xs-12 col-md-6">
          <div className="reporting-card">
            {/* Bar chart  */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sampleData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="passed" stackId="a" fill="#82ca9d" name="Metrics Passed" />
                <Bar dataKey="failed" stackId="a" fill="#d87272ff" name="Metrics Failed" />
                <Bar dataKey="notAssessed" stackId="a" fill="#c3c3c3ff" name="Metrics Not Assessed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Edit Player Modal */}
      {
        <AddOrEditPlayerModal
          show={showEditPlayerModal}
          onClose={() => setShowEditPlayerModal(false)}
          player={player}
        />
      }
    </>
  ) : (
    <div className="page-main-content">
      <LumexSpinner />
    </div>
  );
};

export default PlayerPage;
