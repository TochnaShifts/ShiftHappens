import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/loveable/card";
import { Calendar, Users } from "lucide-react";

const rankColors = [
  "from-green-600 to-green-700",
  "from-purple-600 to-purple-700",
  "from-pink-600 to-pink-700",
  "from-blue-600 to-blue-700",
  "from-yellow-600 to-yellow-700",
];

export const PointsKpis = ({
  groupUserStats,
}: {
  groupUserStats: {
    groupId: string;
    groupName: string;
    rank: number;
    members: number;
    weeklyShifts: number;
    monthlyShifts: number;
  }[];
}) => {
  return (
    <div
      className="gap-6 mb-8"
      style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}
    >
      {groupUserStats.map((group, idx) => (
        <Card
          key={group.groupId}
          className={`border-0 shadow-lg bg-gradient-to-br ${rankColors[idx % rankColors.length]} text-white`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {group.groupName}
            </CardTitle>
            <div className="flex items-center gap-0 mt-2">
              <div className="flex flex-col items-center w-1/2">
                <span className="text-xs opacity-80">דירוג</span>
                <span className="text-2xl font-bold">#{group.rank}</span>
              </div>
              <div className="h-10 border-l border-white/30 mx-0" />
              <div className="flex flex-col items-center w-1/2">
                <span className="text-xs opacity-80">משמרות השבוע</span>
                <span className="text-2xl font-bold">{group.weeklyShifts}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Users className="w-4 h-4" />
              מתוך {group.members} חברים
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
