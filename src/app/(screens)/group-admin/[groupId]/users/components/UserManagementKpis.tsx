import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { useGetGroupUsers } from "../hooks/userManagementHooks";
import { Users, UserCheck, UserX, Crown } from "lucide-react";

interface UserManagementKpisProps {
  groupId: string;
}

export const UserManagementKpis = ({ groupId }: UserManagementKpisProps) => {
  const { data: users, isLoading } = useGetGroupUsers(groupId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-700/50 rounded-lg w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-700/50 rounded-lg w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeUsers = users?.filter(u => u.isActive)?.length || 0;
  const inactiveUsers = users?.filter(u => !u.isActive)?.length || 0;
  const adminUsers = users?.filter(u => u.groups?.some(g => g.groupId === groupId && g.isAdmin))?.length || 0;
  const totalUsers = users?.length || 0;

  const kpiData = [
    {
      title: "סך הכל משתמשים",
      value: totalUsers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/20"
    },
    {
      title: "משתמשים פעילים",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-400",
      bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      iconBg: "bg-green-500/20"
    },
    {
      title: "משתמשים לא פעילים",
      value: inactiveUsers,
      icon: UserX,
      color: "text-red-400",
      bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500/20"
    },
    {
      title: "מנהלי קבוצה",
      value: adminUsers,
      icon: Crown,
      color: "text-orange-400",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <Card 
            key={index} 
            className={`${kpi.bgColor} backdrop-blur-sm hover:scale-105 transition-all duration-300 ${kpi.borderColor} border shadow-lg`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-200 leading-tight">
                  {kpi.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${kpi.iconBg} shadow-inner`}>
                  <IconComponent className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-4xl font-bold ${kpi.color} tracking-tight`}>
                {kpi.value.toLocaleString('he-IL')}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 