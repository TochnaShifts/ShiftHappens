import { Group } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";

const collection = 'groups';

export const createGroup = (data: Group) => createDoc<Group>(collection, data);
export const getGroupById = (id: string) => getDocById<Group>(collection, id);
export const getAllGroups = () => getCollection<Group>(collection);
export const updateGroup = (id: string, data: Partial<Group>) => updateDocById<Group>(collection, id, data);
export const deleteGroup = (id: string) => deleteDocById(collection, id);