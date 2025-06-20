console.log('users.ts loaded');

import { User } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";


const collection = 'users';

export const createUser = (data: User) => createDoc<User>(collection, data);
export const getUserById = (id: string) => getDocById<User>(collection, id);
export const updateUser = (id: string, data: Partial<User>) => updateDocById<User>(collection, id, data);
export const deleteUser = (id: string) => deleteDocById(collection, id);
export const getAllUsers = () => getCollection<User>(collection);