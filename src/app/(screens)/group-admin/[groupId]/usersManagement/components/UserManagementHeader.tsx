import { Group } from "@/app/shared/types";

interface UserManagementHeaderProps {
  groupName: string;
}

export const UserManagementHeader = ({ groupName }: UserManagementHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        ניהול משתמשים בקבוצה
      </h1>
      <p className="text-gray-400">
        ניהול חברי קבוצת {groupName}
      </p>
    </div>
  );
}; 