import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarClock, ClipboardCheck, Users, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  date: Date;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'shift_created':
        return <CalendarClock className="text-blue-600 w-5 h-5 ml-3" />
      case 'request_created':
        return <ClipboardCheck className="text-green-600 w-5 h-5 ml-3" />
      case 'user_joined':
        return <Users className="text-purple-600 w-5 h-5 ml-3" />
      default:
        return <Clock className="text-gray-400 w-5 h-5 ml-3" />
    }
  };

  const formatTimeAgo = (date: Date) => {
    try {
      const activityDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(activityDate.getTime())) {
        return 'תאריך לא ידוע';
      }
      
      return formatDistanceToNow(activityDate, { addSuffix: true, locale: he });
    } catch (error) {
      return 'תאריך לא ידוע';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 max-h-[373px] overflow-y-auto" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#4B5563 transparent'
    }}>
      <style jsx>{`
        .bg-gray-800::-webkit-scrollbar {
          width: 6px;
        }
        .bg-gray-800::-webkit-scrollbar-track {
          background: transparent;
        }
        .bg-gray-800::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        .bg-gray-800::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
      <CardHeader>
        <CardTitle className="text-white">פעילויות אחרונות</CardTitle>
        <CardDescription className="text-gray-400">
          אירועים ועדכונים אחרונים בקבוצה
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">אין פעילות להצגה.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                {getIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 