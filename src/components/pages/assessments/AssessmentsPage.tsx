import { useMemo } from "react";
import "./AssessmentsPage.scss";
import { FaBible, FaDumbbell } from "react-icons/fa";
import { FaBaseballBatBall } from "react-icons/fa6";
import { PiPersonSimpleThrowBold } from "react-icons/pi";
import { IoMdStopwatch } from "react-icons/io";
import { GrYoga } from "react-icons/gr";
import { TbCategory2 } from "react-icons/tb";

const AssessmentsPage: React.FC = () => {
  // Array of assessment types
  const assessmentTypes = useMemo(
    () => [
      {
        value: "hitting-session",
        label: "Hitting Session",
        icon: <FaBaseballBatBall size={26} />,
        description:
          "A focused hitting practice session to evaluate batting performance and technique",
      },
      {
        value: "bullpen",
        label: "Bullpen",
        icon: <PiPersonSimpleThrowBold size={24} />,
        description:
          "Assesses pitch type, location, velocity and other pitching metrics",
      },
      {
        value: "weightroom-maxes",
        label: "Weightroom Maxes",
        icon: <FaDumbbell size={24} />,
        description:
          "Max lifts for key exercises to evaluate strength and power",
      },
      {
        value: "showcase-skills",
        label: "Showcase Skills",
        icon: <IoMdStopwatch size={24} />,
        description:
          "Arm strength, exit velocity and sprint times for recruiting evaluation",
      },
      {
        value: "mobility-screening",
        label: "Mobility Screening",
        icon: <GrYoga size={24} />,
        description:
          "Assessment of joint mobility and flexibility to identify potential range of motion limitations",
      },
      {
        value: "build-your-own",
        label: "Build Your Own",
        icon: <TbCategory2 size={24} />,
        description:
          "Select a variety of metrics to create a custom assessment",
      },
    ],
    []
  );

  return (
    <div className="page-main-content" style={{ height: "calc(100vh - 60px)" }}>
      <div className="assessments-page-header">
        <div>
          <h1>Assessments Types</h1>
          <p className="assessments-subtitle">
            Choose an assessment type to evaluate player performance
          </p>
        </div>
      </div>

      <div className="assessments-container">
        <div className="assessment-types-grid gap-0">
          {assessmentTypes.map((type) => (
            <div className="assessment-type-card-wrapper xs-col-12 col-sm-6 col-xl-4">
              <div key={type.value} className="assessment-type-card">
                <div className="d-flex align-items-center">
                  {type.icon}
                  <h2>{type.label}</h2>
                </div>
                <p>{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
