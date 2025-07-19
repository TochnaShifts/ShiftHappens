"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";
import { LoadingSpinner } from "@/app/components";
import { UserManagementHeader, UserManagementKpis, UserManagementTable, UserDetailSheet } from "./components";
import { User } from "@/app/shared/types";

export default function GroupUserManagement() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

  // Check if user is admin of this specific group
  const isGroupAdmin = user?.groups?.some((group) => group.groupId === groupId && group.isAdmin) || false;
  const isGlobalAdmin = user?.isGlobalAdmin || false;

  // Check if user has permission to access this group
  if (!isGroupAdmin && !isGlobalAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center" dir="rtl">
        <h2 className="text-xl font-semibold text-white mb-2">אין לך הרשאה</h2>
        <p className="text-gray-400">אין לך הרשאה לגשת לניהול קבוצה זו</p>
      </div>
    );
  }

  // Show loading if user data is not loaded yet
  if (!user) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  // Get group data from user's groups
  const currentGroup = user.groups?.find((group) => group.groupId === groupId);
  
  // For now, we'll use a placeholder group name since we don't have the full group data
  const groupName = currentGroup ? `קבוצה ${groupId.slice(0, 8)}` : "קבוצה לא ידועה";

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const handleCloseUserDetail = () => {
    setIsUserDetailOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      <div className="p-6 space-y-6">
        <UserManagementHeader groupName={groupName} />
        <UserManagementKpis groupId={groupId} />
        <UserManagementTable 
          groupId={groupId} 
          onUserSelect={handleUserSelect}
        />
        <UserDetailSheet 
          groupId={groupId}
          selectedUser={selectedUser}
          isOpen={isUserDetailOpen}
          onClose={handleCloseUserDetail}
        />
      </div>
    </div>
  );
} 