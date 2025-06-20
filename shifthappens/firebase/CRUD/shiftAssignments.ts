import { ShiftAssignment } from "../../types/models";
import { createDoc, deleteDocById, getCollection, updateDocById } from "../firestore-crud";

const collection = 'shiftAssignments';

export const createShiftAssignment = (data: ShiftAssignment) => createDoc<ShiftAssignment>(collection, data);
export const getAllShiftAssignments = () => getCollection<ShiftAssignment>(collection);
export const deleteShiftAssignment = (id: string) => deleteDocById(collection, id);
export const updateShiftAssignment = (id: string, data: Partial<ShiftAssignment>) => updateDocById<ShiftAssignment>('shiftAssignments', id, data);