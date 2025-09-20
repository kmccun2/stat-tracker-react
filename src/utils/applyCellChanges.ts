import { GridAssessment } from "@/components/pages/assessments/new-assessment/BuildYourOwnAssessment";
import { CellChange } from "@silevis/reactgrid";
import _ from "lodash";

export const applyCellChanges = (changes: CellChange<any>[], assessments: GridAssessment[]): GridAssessment[] => {
  let _assessments = [...assessments];
  changes.forEach((change) => {
    const { type, text, date, selectedValue, isOpen } = change.newCell;

    const assessmentIndex = Number(change.rowId);
    const fieldName = change.columnId;

    switch (type) {
      case "text":
        _assessments[assessmentIndex][fieldName] = text;
        break;
      case "date":
        _assessments[assessmentIndex][fieldName] = date;
        break;
      case "dropdown":
        _assessments[assessmentIndex].isOpen = isOpen;
        _assessments[assessmentIndex].playerName = text;
        _assessments[assessmentIndex].playerId = selectedValue;
        console.log(_assessments[assessmentIndex]);
        console.log(change);
        break;
      default:
        console.log("Type not found. Type: " + type);
        break;
    }
  });
  return _assessments;
};
