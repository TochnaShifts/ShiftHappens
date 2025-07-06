import { Group } from "@/app/shared/types/models";
import { getGroupById } from "../groups";
import { getPointsByGroup } from "../userGroupPoints";
import { getAllUsers } from "../users";
import { validCollection } from "@/app/shared/utils/firestoreConverters";
import { query, where, getDocs } from "firebase/firestore";
import { getUserRankInGroup } from "../userGroupPoints";
import { getUserWeeklyAndMonthlyShiftsInGroup } from "../shifts";
import { log } from "console";

export async function getGroupsMembersPoints(
    groupsIds: string[]
  ): Promise<
    {
      groupId: string;
      groupName: string;
      members: {
        userId: string;
        name: string;
        points: number;
        status: boolean;
        monthlyShifts: number;
      }[];
    }[]
  > {
    
    return Promise.all(groupsIds.map(async (groupId) => getGroupMembersPoints(groupId)));
  }
  
  export async function getGroupMembersPoints(groupId: string){ 
    // Get all points for the group
    const group = await getGroupById(groupId);
    const points = await getPointsByGroup(groupId);
    const users = await getAllUsers();
    const groupUsers = users.filter((u) =>u.groups.some((g) => g.groupId === groupId));
  
    const monthlyShifts = await getGroupMonthlyShifts(groupId);

    // Map userId to monthly shift count
    const monthlyShiftCount: Record<string, number> = {};
    monthlyShifts.forEach((shift) => {
      shift.users.forEach((uid: string) => {
        monthlyShiftCount[uid] = (monthlyShiftCount[uid] || 0) + 1;
      });
    });

  
    // For each member, join with user info and monthlyShifts
    return {
      groupId: groupId,
      groupName: group?.displayName || "",
      members: points.map((p) => {
      const user = groupUsers.find((u) => u.id === p.userId);
      return {
        userId: p.userId,
        name: user?.name || "",
        points: p.count,
        status: user?.isActive || false,
        monthlyShifts: monthlyShiftCount[p.userId] || 0,
      };
        }),
    };
  }


const getGroupMonthlyShifts = async (groupId: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const shiftsRef = validCollection("shifts");
    const q = query(
      shiftsRef,
      where("groupId", "==", groupId),
      where("startDate", ">=", startOfMonth),
      where("startDate", "<=", endOfMonth)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
}

  export async function getGroupUserStats(data: {
    userId: string;
    groupIds: string[];
  }) {
    const { userId, groupIds } = data;
  
    const groupsStats = await Promise.all(groupIds.map(async (groupId) => {
      const {rank, members} = await getUserRankInGroup(userId, groupId);
      const { groupName, weeklyShifts, monthlyShifts } = await getUserWeeklyAndMonthlyShiftsInGroup(groupId, userId);
      return { groupId, groupName, rank, members, weeklyShifts, monthlyShifts };
    }));
  
    return groupsStats;
  }
