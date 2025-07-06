import { getDoc, doc, where, getDocs, query, collection as firestoreCollection, orderBy } from "firebase/firestore";
import { Group, User } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { db } from "../clientApp";
import { docTo, validCollection } from "../../utils/firestoreConverters";
import { getUserPointsByGroup } from "./userGroupPoints";

const collection = 'groups';

export const createGroup = (data: Group) => createDoc<Group>(collection, data);
export const getAllGroups = () => getCollection<Group>(collection);
export const updateGroup = (id: string, data: Partial<Group>) => updateDocById<Group>(collection, id, data);
export const deleteGroup = (id: string) => deleteDocById(collection, id);

export async function getGroupById(id: string) {
    const groupsCollection = validCollection<Group>(collection);
  const docRef = doc(groupsCollection, id);
  const snapshot = await getDoc(docRef);
  const group = snapshot.exists() ? docTo<Group>(snapshot) : null;
  return group;
}
  
  
  // Batch fetch groups by ids:
  export async function getGroupsByIds(ids: string[]) {
    const promises = ids.map(id => getGroupById(id));
    const groups = await Promise.all(promises);
    return groups.filter((g): g is Group => g !== null); // remove nulls
  };

  export async function getGroupMembersPoints(groupId: string) {
    const usersGroupPoints = await getUserPointsByGroup(groupId);
  }