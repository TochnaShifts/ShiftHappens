import { Group, Shift, UserGroupPoints } from "@/app/shared/types/models"
import { ShiftStatus } from "@/app/shared/types/enums"
import { db } from "../../clientApp"
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore"
import { timestampToDateConverter, validCollection } from "@/app/shared/utils/firestoreConverters"
import { getEndOfMonth, getStartOfMonth } from "@/app/shared/utils/other"

//user/dashboard/recentActivities
export type RecentActivityItem = {
    type: 'shift_assigned' | 'request_submitted' | 'points_updated' | string
    message: string
    time: string
  }
  
  
  export async function getRecentUserActivity(userId: string): Promise<RecentActivityItem[]> {
    const [shiftSnap, requestSnap, pointsSnap] = await Promise.all([
      getDocs(
        query(
          validCollection('shiftAssignments'),
          where('userId', '==', userId),
          orderBy('assignedAt', 'desc'),
          limit(5)
        )
      ),
      getDocs(
        query(
          validCollection('requests'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
      ),
      getDocs(
        query(
          validCollection('userGroupPoints'),
          where('userId', '==', userId),
          orderBy('lastDate', 'desc'),
          limit(5)
        )
      ),
    ])
  
    const shiftActivities: RecentActivityItem[] = shiftSnap.docs.map(doc => {
      const data = doc.data()
      return {
        type: 'shift_assigned',
        message: 'הוקצתה לך משמרת חדשה',
        time: data.assignedAt.toISOString(),
      }
    })
  
    const requestActivities: RecentActivityItem[] = requestSnap.docs.map(doc => {
      const data = doc.data()
      return {
        type: 'request_submitted',
        message: 'הוגשה בקשת שינוי או חופש',
        time: data.createdAt.toISOString(),
      }
    })
    
        const pointsActivities: RecentActivityItem[] = pointsSnap.docs.map(doc => {
      const data = doc.data()
      return {
        type: 'points_updated',
        message: `עודכנו נקודות בקבוצה (${data.count})`,
        time: data.lastDate.toISOString(),
      }
    })
  
    return [...shiftActivities, ...requestActivities, ...pointsActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
  }


  //user/dashboard/points
  const pointsCollection = 'userGroupPoints'
  const groupCollection = 'groups'
  
  export type RankGroupData = {
    groupId: string
    groupDisplayName: string
    rank: number
    totalUsers: number
  }
  
  async function getRankInGroup(groupId: string, userId: string): Promise<RankGroupData> {
    const pointsRef = validCollection(pointsCollection)
  
    const q = query(pointsRef, where("groupId", "==", groupId), orderBy("count", "desc"))
    const snapshot = await getDocs(q)
  
    const rankedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserGroupPoints[]
  
    const totalUsers = rankedUsers.length
    const userIndex = rankedUsers.findIndex(u => u.userId === userId)
    const rank = userIndex === -1 ? totalUsers : userIndex + 1
  
    // Fetch group name
    const groupSnapshot = await getDocs(query(collection(db, groupCollection), where("id", "==", groupId)))
    const group = groupSnapshot.docs[0]?.data() as Group | undefined
    const groupDisplayName = group?.displayName ?? 'קבוצה לא ידועה'
  
    return {
      groupId,
      groupDisplayName,
      rank,
      totalUsers
    }
  }
  
  export async function getUserRankInEachGroup(userId: string): Promise<RankGroupData[]> {
    const pointsRef = validCollection(pointsCollection)
    const q = query(pointsRef, where("userId", "==", userId))
    const snapshot = await getDocs(q)
  
    const userPoints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserGroupPoints[]
  
    // Call the helper per group
    const results: RankGroupData[] = await Promise.all(
      userPoints.map(entry => getRankInGroup(entry.groupId, userId))
    )
  
    return results
  }




  const shiftsCollection = "shifts";

  export async function getCompletedShiftsHoursThisMonth(userId: string): Promise<{ totalHours: number; completedShiftsCount: number }> {
    const startOfMonth = getStartOfMonth();
    const endOfMonth = getEndOfMonth();
  
    const shiftsRef = validCollection(shiftsCollection);
    
    // Query shifts that:
    // - include this user in the 'users' array
    // - are finished (status === ShiftStatus.Finished)
    // - have startDate in this month
    const q = query(
      shiftsRef,
      where("users", "array-contains", userId),
      where("status", "==", ShiftStatus.Finished),
      where("startDate", ">=", startOfMonth),
      where("endDate", "<=", endOfMonth),
    );
  
    const snapshot = await getDocs(q);
  
    let totalHours = 0;
    let completedShiftsCount = 0;
  
    snapshot.forEach(doc => {
      const data = doc.data() as Shift;
  
      // Since startDate and endDate are Date objects, just calculate difference
      const diffMs = data.endDate.getTime() - data.startDate.getTime();
      const hours = diffMs / (1000 * 60 * 60);
      totalHours += hours;
      completedShiftsCount++;
    });
  
    return { totalHours, completedShiftsCount };
  }