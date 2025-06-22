import { UserGroupPoints } from "../../types/models";
import { createDoc, deleteDocById, getCollection, updateDocById } from "../firestore-crud";

const collection = 'userGroupPoints';

export const getUserGroupPoints = () => getCollection<UserGroupPoints>(collection);
export const updateUserGroupPoints = (id: string, data: Partial<UserGroupPoints>) => updateDocById<UserGroupPoints>(collection, id, data);
export const deleteUserGroupPoints = (id: string) => deleteDocById(collection, id);
export const createUserGroupPoints = (data: UserGroupPoints) => createDoc<UserGroupPoints>(collection, data);