import { GridAssessment } from "@/components/pages/assessments/new-assessment/BuildYourOwnAssessment";
import { CellChange } from "@silevis/reactgrid";
import _ from "lodash";

export const applyCellChanges = (changes: CellChange<any>[], assessments: GridAssessment[]): GridAssessment[] => {
  let _assessments = [...assessments];

  changes.forEach((change) => {
    const { type, text, date, selectedValue, isOpen } = change.newCell;
    const assessmentIndex = Number(change.rowId);
    const fieldName = change.columnId;

    // Validate index to prevent out-of-bounds errors
    if (assessmentIndex < 0 || assessmentIndex >= _assessments.length) {
      console.warn(`Invalid assessment index: ${assessmentIndex}`);
      return;
    }

    switch (type) {
      case "text":
        _assessments[assessmentIndex] = {
          ..._assessments[assessmentIndex],
          [fieldName]: text,
        };
        break;
      case "date":
        _assessments[assessmentIndex] = {
          ..._assessments[assessmentIndex],
          [fieldName]: date,
        };
        break;
      case "dropdown":
        // Combine all dropdown updates into a single object
        _assessments[assessmentIndex] = {
          ..._assessments[assessmentIndex],
          // Only update playerName and playerId if isOpen is true and values are provided
          ...(isOpen && selectedValue !== undefined && text !== undefined
            ? { playerName: text, playerId: selectedValue }
            : {}),
          // Only update isOpen if it's defined
          ...(isOpen !== undefined ? { isOpen } : {}),
        };
        console.log("Updated assessment:", _assessments[assessmentIndex]);
        // console.log("Dropdown values:", { selectedValue, isOpen, text });
        break;
      default:
        console.warn(`Unsupported cell type: ${type}`);
        break;
    }
  });

  return _assessments;
};
