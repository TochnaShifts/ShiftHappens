import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { getGroupColor } from "./utils";
import { ShiftStatus } from "@/app/shared/types/enums";
import { Group, User } from "@/app/shared/types";

export const CalendarLegends = ({ shifts, userGroups, user }: { shifts: any[], userGroups: Group[], user: User }) => {
    // Get the groupIds where the user is NOT an admin (same logic as calendar page)
    const nonAdminGroupIds = user.groups.filter(g => !g.isAdmin).map(g => g.groupId);
    
    // Filter userGroups to only include those where the user is NOT an admin
    const userParticipatingGroups = (userGroups || [])
      .filter(g => nonAdminGroupIds.includes(g.id));
    
    const uniqueGroupIds = userParticipatingGroups.map(group => group.id);
    
    return (
      <Card className="border-0 shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">מקרא</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            {/* Groups Section */}
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                קבוצות
              </h4>
              <div className="flex flex-wrap gap-3">
                {userParticipatingGroups.map((group) => (
                  <div key={group.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${getGroupColor(group.id, uniqueGroupIds).split(' ')[0]}`}></div>
                    <span className="text-sm font-medium text-gray-700">{group.displayName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Status Section */}
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                סטטוס משמרות
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-3 h-3 bg-yellow-400 border border-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">⏳</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">פעיל</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">הושלם</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-3 h-3 bg-red-500 border border-red-600 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">✕</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">בוטל</span>
                </div>
              </div>
            </div>

            {/* Requests Section */}
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                בקשות
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">הסתייגות</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">העדפה</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-2 h-2 border-2 border-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">היום</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  