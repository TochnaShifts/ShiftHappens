import { getDocs, query, where, collection as firestoreCollection } from "firebase/firestore";
import { User } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById, getDocByField } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";
import { is } from "date-fns/locale";

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

export const getUsersByGroupId = async (groupId: string): Promise<User[]> => {
    const usersRef = validCollection<User>(collection);
    
    // Get all users and filter by group membership
    const snapshot = await getDocs(usersRef);
    
    const users: User[] = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        // Check if user is in this group (either as admin or regular member)
        const isInGroup = data.groups?.some((group: any) => group.groupId === groupId);
        if (isInGroup) {
            users.push({
                id: doc.id,
                ...data
            } as User);
        }
    });
    
    return users;
};