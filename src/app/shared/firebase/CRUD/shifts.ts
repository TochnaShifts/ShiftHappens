import { Shift } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";

const collection = 'shifts';

export const createShift = (data: Shift) => createDoc<Shift>(collection, data);
export const getShiftById = (id: string) => getDocById<Shift>(collection, id);
export const getAllShifts = () => getCollection<Shift>(collection);
export const updateShift = (id: string, data: Partial<Shift>) => updateDocById<Shift>(collection, id, data);
export const deleteShift = (id: string) => deleteDocById(collection, id);