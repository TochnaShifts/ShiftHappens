import { getDocs, query, orderBy, where } from "firebase/firestore";
import { Shift } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";
import { getAllGroups, getGroupById } from "./groups";

const collection = 'shifts';

export const createShift = (data: Shift) => createDoc<Shift>(collection, data);
export const getShiftById = (id: string) => getDocById<Shift>(collection, id);
export const getAllShifts = () => getCollection<Shift>(collection);
export const updateShift = (id: string, data: Partial<Shift>) => updateDocById<Shift>(collection, id, data);
export const deleteShift = (id: string) => deleteDocById(collection, id);

export async function getUserUpcomingShifts(userId: string): Promise<(Shift & { groupName: string })[]> {
    const shiftsRef = validCollection<Shift>(collection)
    const q = query(
      shiftsRef,
      where('users', 'array-contains', userId),
      where('isFinished', '==', false),
      orderBy('startDate', 'desc')
    )
    const snapshot = await getDocs(q)
  
    const groups = await getAllGroups();
    const groupsMap = new Map(groups.map(group => [group.id, group.displayName]));
    
    const shifts: (Shift & { groupName: string })[] = []
    snapshot.forEach(doc => {
      const data = doc.data()
      const groupName = groupsMap.get(data.groupId) ?? ''
      shifts.push({
        id: doc.id,
        ...data,
        groupName,
      } as Shift & { groupName: string })
    })
  
    return shifts
  }

export async function getAllShiftsForUser(userId: string): Promise<(Shift & { groupName: string })[]> {
  const shiftsRef = validCollection<Shift>(collection)
  const q = query(
    shiftsRef,
    where('users', 'array-contains', userId),
    orderBy('startDate', 'desc')
  )
  const snapshot = await getDocs(q)

  const groups = await getAllGroups();
  const groupsMap = new Map(groups.map(group => [group.id, group.displayName]));

  const shifts: (Shift & { groupName: string })[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    const groupName = groupsMap.get(data.groupId) ?? ''
    shifts.push({
      id: doc.id,
      ...data,
      groupName,
    } as Shift & { groupName: string })
  })

  return shifts
} 

export async function getUserWeeklyAndMonthlyShiftsInGroup(groupId: string, userId: string) {
  const allShifts = await getAllShiftsForUser(userId);
  const groupName = (await getGroupById(groupId))?.displayName;
  const { weekAgo, startOfMonth, now } = getMonthDetails();
  const weeklyShifts = allShifts.filter(s => s.groupId === groupId && new Date(s.startDate) >= weekAgo && new Date(s.startDate) <= now).length;
  const monthlyShifts = allShifts.filter(s => s.groupId === groupId && new Date(s.startDate) >= startOfMonth && new Date(s.startDate) <= now).length;
  return { groupName, weeklyShifts, monthlyShifts };
}

const getMonthDetails = (): {weekAgo: Date, startOfMonth: Date, now: Date} => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { weekAgo, startOfMonth, now };
}