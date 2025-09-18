import { useMemo } from "react";
import "./AssessmentsPage.scss";
import { FaDumbbell } from "react-icons/fa";
import { FaBaseballBatBall } from "react-icons/fa6";
import { PiPersonSimpleThrowBold } from "react-icons/pi";
import { IoMdStopwatch } from "react-icons/io";
import { GrYoga } from "react-icons/gr";
import { TbCategory2 } from "react-icons/tb";
import { LuClipboardPen } from "react-icons/lu";
import PageHeader from "@/components/common/page-header/PageHeader";
import { useNavigate } from "react-router-dom";

const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();

  // Array of assessment types
  const assessmentTypes = useMemo(
    () => [
      {
        value: "coming-soon",
        label: "Hitting Session",
        icon: <FaBaseballBatBall size={34} />,
        description: "A focused hitting practice session to evaluate batting performance and technique",
      },
      {
        value: "comming-soon",
        label: "Bullpen",
        icon: <PiPersonSimpleThrowBold size={34} />,
        description: "Assesses pitch type, location, velocity and other pitching metrics",
      },
      {
        value: "coming-soon",
        label: "Weightroom Maxes",
        icon: <FaDumbbell size={34} />,
        description: "Max lifts for key exercises to evaluate strength and power",
      },
      {
        value: "coming-soon",
        label: "Showcase Skills",
        icon: <IoMdStopwatch size={34} />,
        description: "Arm strength, exit velocity and sprint times for recruiting evaluation",
      },
      {
        value: "coming-soon",
        label: "Mobility Screening",
        icon: <GrYoga size={34} />,
        description: "Assessment of joint mobility and flexibility to identify potential range of motion limitations",
      },
      {
        value: "build-your-own",
        label: "Build Your Own",
        icon: <TbCategory2 size={34} />,
        description: "Select a variety of metrics to create a custom assessment",
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Assessment Metrics"
        subtitle="Choose from predefined assessment types or create a custom assessment"
        icon={<LuClipboardPen />}
        actions={
          // No add metric feature for MVP
          <></>
          // <MetricActions onAddMetric={handleAddMetricClick} />
        }
      />
      <div className="page-main-content" style={{ height: "calc(100vh - 60px)" }}>
        <div className="assessments-container">
          {assessmentTypes.map((type) => (
            <div
              className="assessment-type-card-wrapper col-12"
              onClick={() => navigate(`/assessments/new/${type.value}`)}
            >
              <div key={type.value} className="assessment-type-card">
                <div className="d-flex flex-column justify-content-center">
                  <h2>{type.label}</h2>
                  <p>{type.description}</p>
                </div>
                <div className="assessment-type-icon">{type.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssessmentsPage;
