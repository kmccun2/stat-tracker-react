import { Assessment } from "@/types/assessment";
import { CellChange, DefaultCellTypes, DropdownCell } from "@silevis/reactgrid";

export const applyCellChanges = (
  changes: CellChange<DefaultCellTypes>[],
  prevAssessments: Assessment[]
): Assessment[] => {
  const updatedAssessments = prevAssessments.map((assessment) => ({ ...assessment }));

  changes.forEach((change) => {
    const assessmentIndex = Number(change.rowId);
    const fieldName = change.columnId as keyof Assessment;

    // Validate rowId and columnId
    if (
      isNaN(assessmentIndex) ||
      assessmentIndex < 0 ||
      assessmentIndex >= updatedAssessments.length ||
      !(fieldName in updatedAssessments[assessmentIndex])
    ) {
      console.warn(`Invalid rowId (${change.rowId}) or columnId (${change.columnId})`);
      return;
    }

    switch (change.newCell.type) {
      case "text":
        updatedAssessments[assessmentIndex][fieldName] = change.newCell.text;
        break;
      case "number":
        updatedAssessments[assessmentIndex][fieldName] = change.newCell.value;
        break;
      case "date":
        updatedAssessments[assessmentIndex][fieldName] = change.newCell.date;
        break;
      case "dropdown":
        const newCell = change.newCell as DropdownCell;
        const prevCell = change.previousCell as DropdownCell;
        if (newCell.selectedValue != null && newCell.selectedValue !== prevCell.selectedValue) {
          updatedAssessments[assessmentIndex][fieldName] = newCell.selectedValue;
        }
        if ("isOpen" in updatedAssessments[assessmentIndex]) {
          updatedAssessments[assessmentIndex]["isOpen"] = newCell.isOpen;
        }
        break;
      default:
        console.warn(`Unsupported cell type: ${change.newCell.type}`);
        break;
    }
  });

  return updatedAssessments;
};
