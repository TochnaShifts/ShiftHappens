import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Calendar, BarChart3, Users, Clock } from "lucide-react";
import { Shift } from "@/app/shared/types";
import { RecentActivityItem } from "@/app/shared/firebase/CRUD/regularUser/dashboard";

type UserRank = {
  groupId: string;
  groupDisplayName: string;
  rank: number;
  totalUsers: number;
};

type PointsData = {
  groupId: string;
  groupName: string;
  count: number;
};

interface QuickStatsCardsProps {
  upcomingShifts: Shift[];
  pointsData: PointsData[];
  recentActivity: RecentActivityItem[];
  userRanks: UserRank[];
  completedShiftsHoursThisMonth: {
    totalHours: number;
    completedShiftsCount: number;
  };
}

export const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({
  upcomingShifts,
  userRanks,
  completedShiftsHoursThisMonth,
}) => {
  // Find the first userRank with a rank to display (or default)
  const firstRank = userRanks.length > 0 ? userRanks[0] : null;

  // Upcoming shifts count
  const upcomingCount = upcomingShifts.length;

  // Show text for next upcoming shift date (or fallback)
  const nextShift = upcomingShifts.length > 0 ? upcomingShifts[0] : null;
  const nextShiftDateText = nextShift
    ? `המשמרת הבאה ב-${new Date(nextShift.startDate).toLocaleDateString()}`
    : "אין משמרות קרובות";

  // Fixed color palette for up to 5 groups
  const rankColors = [
    'from-green-600 to-green-700',
    'from-purple-600 to-purple-700',
    'from-pink-600 to-pink-700',
    'from-blue-600 to-blue-700',
    'from-yellow-600 to-yellow-700',
  ];

  // Use a responsive grid that splits KPIs evenly, regardless of count
  const gridClass = "grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className={gridClass} style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}>
      {/* משמרות קרובות */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">משמרות קרובות</CardTitle>
          <div className="text-2xl font-bold">{upcomingCount}</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs opacity-75">{nextShiftDateText}</p>
          <Calendar className="w-4 h-4 opacity-75 mt-2" />
        </CardContent>
      </Card>

      {userRanks.map((rank, idx) => (
        <Card
          key={rank.groupId}
          className={`border-0 shadow-lg bg-gradient-to-br ${rankColors[Math.min(idx, rankColors.length - 1)]} text-white`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              דירוג {rank.groupDisplayName} 
            </CardTitle>
            <div className="text-2xl font-bold">
              #{rank.rank}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs opacity-75">
              מתוך {rank.totalUsers} חברים
            </p>
          </CardContent>
        </Card>
      ))}

      {/* שעות החודש */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">שעות החודש</CardTitle>
          <div className="text-2xl font-bold">
            {Math.floor(completedShiftsHoursThisMonth.totalHours)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs opacity-75">
            {completedShiftsHoursThisMonth.completedShiftsCount} משמרות הושלמו
          </p>
          <Clock className="w-4 h-4 opacity-75 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};
