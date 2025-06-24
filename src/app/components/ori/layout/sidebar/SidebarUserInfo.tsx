import { Bell } from "lucide-react";
import { Button } from "@/app/components/loveable";
import { Badge } from "@/app/components/loveable/badge";

interface SidebarUserInfoProps {
  user: { name?: string } | null | undefined;
  status: { label: string; icon: React.ComponentType<any> | null; color: string };
  onNotificationsClick: () => void;
}

export const SidebarUserInfo = ({ user, status, onNotificationsClick }: SidebarUserInfoProps) => {
  const StatusIcon = status.icon;

  return (
    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white truncate">{user?.name || "משתמש"}</p>
        <div className={`flex items-center space-x-1 space-x-reverse ${status.color}`}>
          <p className="text-xs">{status.label}</p>
          {StatusIcon && <StatusIcon className="w-3 h-3" />}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white hover:bg-gray-800"
        onClick={onNotificationsClick}
      >
        <Bell className="w-4 h-4" />
        <Badge className="mr-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
          3
        </Badge>
      </Button>
    </div>
  );
}

export default SidebarUserInfo;