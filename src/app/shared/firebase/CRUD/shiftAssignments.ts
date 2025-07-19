import { getDocs, query, where } from "firebase/firestore";
import { ShiftAssignment } from "../../types/models";
import { createDoc, deleteDocById, getCollection, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";

const collection = 'shiftAssignments';

export const createShiftAssignment = (data: ShiftAssignment) => createDoc<ShiftAssignment>(collection, data);
export const getAllShiftAssignments = () => getCollection<ShiftAssignment>(collection);
export const deleteShiftAssignment = (id: string) => deleteDocById(collection, id);
export const updateShiftAssignment = (id: string, data: Partial<ShiftAssignment>) => updateDocById<ShiftAssignment>('shiftAssignments', id, data);

export const getShiftAssignmentsByUserId = async (userId: string): Promise<ShiftAssignment[]> => {
  const q = query(validCollection(collection), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const assignments: ShiftAssignment[] = [];
  querySnapshot.forEach(doc => {
    assignments.push({
      id: doc.id,
      ...doc.data()
    } as ShiftAssignment);
  });
  
  return assignments;
};