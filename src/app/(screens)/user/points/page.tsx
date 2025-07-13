"use client";

import { useState } from "react";
import { BarChart3, Users, Calendar, TrendingUp, Medal, Trophy, Award } from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { useGroupMembersPoints, useGroupsUserStats } from "./hooks/pointsHooks";
import PointsHeader from "./components/PointsHeader";
import { PointsKpis } from "./components/PointsKpis";
import GroupMembersTable from "./components/GroupMembersTable/GroupMembersTable";

export default function PointsPage() {
  const { user } = useUser();
  const groupIds = user!.groups.filter((group) => !group.isAdmin).map((group) => group.groupId);
  const { data: groupMembersPoints } = useGroupMembersPoints(user!.id, groupIds);
  const { data: groupUserStats } = useGroupsUserStats(user!.id,groupIds);

  console.log("groupMembersPoints", groupMembersPoints);
  console.log("groupUserStats", groupUserStats);
  if (!user || !groupMembersPoints || !groupUserStats) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      dir="rtl"
    >
      <PointsHeader />
      <div className="container mx-auto px-4 py-8">
        <PointsKpis groupUserStats={groupUserStats}/>
        <GroupMembersTable groupMembersPoints={groupMembersPoints} currentUserId={user.id}/>
      </div>
    </div>
  );
}
