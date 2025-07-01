import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { getGroupColor } from "./groupColorUtils";

export const CalendarLegends = ({ shifts }: { shifts: any[] }) => {
    // Get unique groupIds and groupNames for legend
    const groupMap = new Map();
    shifts.forEach((shift) => {
      if (!groupMap.has(shift.groupId)) {
        groupMap.set(shift.groupId, shift.groupName || shift.groupId);
      }
    });

    const uniqueGroupIds = Array.from(groupMap.keys());
    
    return (
      <Card className="border-0 shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">מקרא</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {uniqueGroupIds.map((groupId) => (
              <div key={groupId} className="flex items-center space-x-2 space-x-reverse">
                <div className={`w-4 h-4 rounded ${getGroupColor(groupId, uniqueGroupIds).split(' ')[0]}`}></div>
                <span className="text-sm text-gray-600">{groupMap.get(groupId)}</span>
              </div>
            ))}
            {/* Exclude request legend */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">הסתייגות</span>
            </div>
            {/* Today legend */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">היום</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  