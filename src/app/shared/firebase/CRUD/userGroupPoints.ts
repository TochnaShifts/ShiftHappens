import { collection as firestoreCollection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { UserGroupPoints } from "../../types/models";
import { createDoc, deleteDocById, getCollection, updateDocById } from "../firestore-crud";
import { db } from "../clientApp";
import { validCollection } from "../../utils/firestoreConverters";

const userGroupPointsCollection = 'userGroupPoints';
const groupsCollection = 'groups';

export const getUserGroupPoints = () => getCollection<UserGroupPoints>(userGroupPointsCollection);
export const updateUserGroupPoints = (id: string, data: Partial<UserGroupPoints>) => updateDocById<UserGroupPoints>(userGroupPointsCollection, id, data);
export const deleteUserGroupPoints = (id: string) => deleteDocById(userGroupPointsCollection, id);
export const createUserGroupPoints = (data: UserGroupPoints) => createDoc<UserGroupPoints>(userGroupPointsCollection, data);


export async function getUserPointsByGroup(userId: string): Promise<{ groupId: string; groupName: string; count: number }[]> {
    const pointsRef = validCollection(userGroupPointsCollection)
    const q = query(pointsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
  
    const pointsWithGroupName = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data() as UserGroupPoints
      const groupRef = doc(db, groupsCollection, data.groupId)
      const groupSnap = await getDoc(groupRef)
  
      const groupName = groupSnap.exists() ? groupSnap.data().displayName : 'קבוצה לא ידועה'
  
      return {
        groupId: data.groupId,
        groupName,
        count: data.count,
      }
    }))
  
    return pointsWithGroupName
  }

  export async function getPointsByGroup(groupId: string): Promise<UserGroupPoints[]> {
    const pointsRef = validCollection(userGroupPointsCollection);
    const q = query(pointsRef, where('groupId', '==', groupId));
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as UserGroupPoints));
  }

  /**
 * Get the rank of a user in a group based on their points.
 * Returns 1-based rank or null if user has no points.
 */
export async function getUserRankInGroup(userId: string, groupId: string): Promise<number | null> {
    const points = await getPointsByGroup(groupId);
    points.sort((a, b) => b.count - a.count);
  
    const rank = points.findIndex(p => p.userId === userId);
    return rank >= 0 ? rank + 1 : null;
  }