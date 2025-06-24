import { getDoc, doc, where, getDocs, query, collection as firestoreCollection } from "firebase/firestore";
import { Group } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { db } from "../clientApp";

const collection = 'groups';

export const createGroup = (data: Group) => createDoc<Group>(collection, data);
export const getAllGroups = () => getCollection<Group>(collection);
export const updateGroup = (id: string, data: Partial<Group>) => updateDocById<Group>(collection, id, data);
export const deleteGroup = (id: string) => deleteDocById(collection, id);

export async function getGroupById(id: string) {
  const q = query(firestoreCollection(db, collection), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  return doc ? { id: doc.id, ...doc.data() } as Group & { id: string } : null;
  }
  
  // Batch fetch groups by ids:
  export async function getGroupsByIds(ids: string[]) {
    const promises = ids.map(id => getGroupById(id));
    const groups = await Promise.all(promises);
    return groups.filter(Boolean); // remove nulls
  }