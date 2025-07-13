import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Calendar, Users, Clock } from "lucide-react";
import { Shift } from "@/app/shared/types";
import { RecentActivityItem } from "@/app/shared/firebase/CRUD/regularUser/dashboard";
import { getGroupIconComponent } from "@/app/shared/utils/groupIcons";

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


  // Use a responsive grid that splits KPIs evenly, regardless of count
  const gridClass = "grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className={gridClass} style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}>
      {/* משמרות קרובות */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-sm font-medium opacity-90">משמרות קרובות</CardTitle>
            <Calendar className="w-5 h-5 opacity-90" />

          </div>
          <div className="text-3xl font-bold">{upcomingCount}</div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-sm opacity-90 font-medium">{nextShiftDateText}</p>
          </div>
        </CardContent>
      </Card>

      {/* דירוגים - Side by Side with Better Colors */}
      {userRanks.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm font-medium opacity-90">דירוגים שלך</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-wrap gap-2">
              {userRanks.slice(0, 3).map((rank, idx) => {
                const rankColors = [
                  'from-amber-400 to-amber-500', // Subtle gold
                  'from-slate-300 to-slate-400', // Subtle silver  
                  'from-orange-400 to-orange-500' // Subtle bronze
                ];
                
                const GroupIcon = getGroupIconComponent(rank.groupDisplayName);
                
                return (
                  <div 
                    key={rank.groupId} 
                    className="flex-1 min-w-0 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/15 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColors[idx] || 'from-blue-400 to-blue-500'} flex items-center justify-center text-xs font-bold mx-auto mb-2 shadow-md`}>
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium truncate">{rank.groupDisplayName}</p>
                      <p className="text-xs opacity-75 mt-1">#{rank.rank}</p>
                    </div>
                  </div>
                );
              })}
              {userRanks.length > 3 && (
                <div className="flex-1 min-w-0 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center text-xs font-bold mx-auto mb-2 shadow-md">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium">ועוד</p>
                    <p className="text-xs opacity-75 mt-1">{userRanks.length - 3} קבוצות</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* שעות החודש */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-sm font-medium opacity-90">שעות החודש</CardTitle>
            <Clock className="w-5 h-5 opacity-90" />

          </div>
          <div className="text-3xl font-bold">
            {Math.floor(completedShiftsHoursThisMonth.totalHours)}
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-sm opacity-90 font-medium">
              {completedShiftsHoursThisMonth.completedShiftsCount} משמרות הושלמו
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
