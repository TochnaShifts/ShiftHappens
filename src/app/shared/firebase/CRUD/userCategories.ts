import { UserCategory } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";

const collection = 'userCategories';

export const getAllUserCategories = () => getCollection<UserCategory>(collection);
export const getUserCategoryById = (id: string) => getDocById<UserCategory>(collection, id);
export const createUserCategory = (data: UserCategory) => createDoc<UserCategory>(collection, data);
export const updateUserCategory = (id: string, data: Partial<UserCategory>) => updateDocById<UserCategory>(collection, id, data);
export const deleteUserCategory = (id: string) => deleteDocById(collection, id);