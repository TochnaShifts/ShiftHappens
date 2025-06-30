import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { RecentActivityItem } from "@/app/shared/firebase"
import { formatDistanceToNow } from "date-fns"
import { he } from "date-fns/locale"
import { CalendarClock, Star, ClipboardCheck } from "lucide-react"

type Props = {
  activity: RecentActivityItem[]
}

export const RecentActivityCard = ({ activity }: Props) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "shift_assigned":
        return <CalendarClock className="text-blue-600 w-5 h-5 ml-3" />
      case "request_submitted":
        return <ClipboardCheck className="text-green-600 w-5 h-5 ml-3" />
      case "points_updated":
        return <Star className="text-yellow-500 w-5 h-5 ml-3" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full ml-3" />
    }
  }

  return (
    <Card className="border-0 shadow-lg mt-8 max-h-[328px] overflow-y-auto">
      <CardHeader>
        <CardTitle>פעילות אחרונה</CardTitle>
        <CardDescription>
          העדכונים וההתראות האחרונות שלך.
          <span className="font-medium text-blue-600"> בקשות חופש מעובדות אוטומטית ללא צורך באישור.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">אין פעילות להצגה.</p>
        ) : (
          <div className="space-y-4">
            {activity.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                {getIcon(item.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.time), { addSuffix: true, locale: he })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
