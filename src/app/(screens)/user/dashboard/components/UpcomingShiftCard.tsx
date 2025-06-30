import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { Badge } from "@/app/components/loveable/badge"
import { Button } from "@/app/components/loveable/button"
import { Calendar, Clock } from "lucide-react"
import { Shift } from "@/app/shared/types/models"
import { formatTimeRange } from "@/app/shared/utils/other"

interface Props {
  shifts: (Shift & { groupName: string })[]
}

export const UpcomingShiftsCard = ({ shifts }: Props) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 ml-2 text-blue-600" />
          משמרות קרובות
        </CardTitle>
        <CardDescription>המשמרות שהוקצו לך</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{shift.displayName}</h3>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  +{shift.points} נק'
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{shift.groupName}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 ml-1" />
                {shift.startDate.toLocaleDateString("he-IL")} • {formatTimeRange(shift.startDate, shift.endDate)}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          צפה בכל המשמרות
        </Button>
      </CardContent>
    </Card>
  )
}
