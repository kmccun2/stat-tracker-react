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
        if (isOpen) {
          _assessments[assessmentIndex].playerName = text;
          _assessments[assessmentIndex].playerId = selectedValue;
        }
        _assessments[assessmentIndex].isOpen = isOpen;
        console.log(_assessments[assessmentIndex]);
        console.log(selectedValue, isOpen);
        break;
      default:
        break;
    }
  });
  return _assessments;
};
