import { getDocs, query, where, collection as firestoreCollection } from "firebase/firestore";
import { User } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById, getDocByField } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";

const collection = 'users';

export const createUser = (data: User) => createDoc<User>(collection, data);
export const getUserById = (id: string) => getDocById<User>(collection, id);
export const updateUser = (id: string, data: Partial<User>) => updateDocById<User>(collection, id, data);
export const deleteUser = (id: string) => deleteDocById(collection, id);
export const getAllUsers = () => getCollection<User>(collection);

export const getUserByUsername = async (username: string) => {
    const q = query(validCollection(collection), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc ? { id: doc.id, ...doc.data() } as User & { id: string } : null;
}