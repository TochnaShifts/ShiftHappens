import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { Calendar, Clock, TrendingUp, Star } from "lucide-react"

interface ShiftHistoryStatsProps {
  stats: {
    totalHours: number
    completedShiftsCount: number
    totalPoints: number
  }
}

export const ShiftHistoryStats = ({ stats }: ShiftHistoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-800">{stats.completedShiftsCount}</div>
              <div className="text-sm text-blue-600">משמרות שהושלמו</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{stats.totalHours}</div>
              <div className="text-sm text-green-600">שעות עבודה</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-800">{stats.totalPoints}</div>
              <div className="text-sm text-purple-600">נקודות שהושגו</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 