import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Calendar, ClipboardList, Users } from "lucide-react";

interface KpiCardsProps {
  upcomingShiftsCount: number;
  requestsCount: number;
  membersCount: number;
}

export const KpiCards = ({ 
  upcomingShiftsCount, 
  requestsCount, 
  membersCount
}: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">משמרות קרובות</CardTitle>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Calendar className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 space-x-reverse">
            <div className="text-3xl font-bold text-white">{upcomingShiftsCount}</div>
            <div className="text-sm text-white/70">משמרות</div>
          </div>
          <p className="text-xs text-white/80 mt-1">השבועיים הקרובים</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">בקשות חברי קבוצה</CardTitle>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 space-x-reverse">
            <div className="text-3xl font-bold text-white">{requestsCount}</div>
            <div className="text-sm text-white/70">בקשות</div>
          </div>
          <p className="text-xs text-white/80 mt-1">החודש הנוכחי</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">חברי קבוצה</CardTitle>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Users className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 space-x-reverse">
            <div className="text-3xl font-bold text-white">{membersCount}</div>
            <div className="text-sm text-white/70">חברים</div>
          </div>
          <p className="text-xs text-white/80 mt-1">בקבוצה</p>
        </CardContent>
      </Card>
    </div>
  );
}; 