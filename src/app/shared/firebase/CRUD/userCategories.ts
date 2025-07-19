import { getDocs, query, where } from "firebase/firestore";
import { UserCategory } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";

const collection = 'userCategories';

export const getAllUserCategories = () => getCollection<UserCategory>(collection);
export const getUserCategories = () => getCollection<UserCategory>(collection); // Alias for consistency
export const createUserCategory = (data: UserCategory) => createDoc<UserCategory>(collection, data);
export const updateUserCategory = (id: string, data: Partial<UserCategory>) => updateDocById<UserCategory>(collection, id, data);
export const deleteUserCategory = (id: string) => deleteDocById(collection, id);

export async function getUserCategoryById(id: string) {
  const q = query(validCollection(collection), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  return doc ? { id: doc.id, ...doc.data() } as UserCategory & { id: string } : null; 
  }

export async function getUserCategoriesByIds(ids: string[]) {
    const promises = ids.map(id => getUserCategoryById(id))
    const categories = await Promise.all(promises)
    return categories.filter(Boolean)
  }