"use client"

import { Card, CardContent } from "@/app/components/loveable/card"
import { Badge } from "@/app/components/loveable/badge"
import { Shift } from "@/app/shared/types"
import { ShiftStatus } from "@/app/shared/types/enums"
import { formatDistanceToNow } from "date-fns"
import { he } from "date-fns/locale"
import { Clock, MapPin, Star, Calendar, CheckCircle, CalendarDays, Award, Zap, Target, TrendingUp, XCircle, PlayCircle } from "lucide-react"

interface ShiftHistoryGridProps {
  shifts: (Shift & { groupName?: string })[]
  currentUserId?: string
}

function formatTimeRange(start: Date, end: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(start.getHours())}:${pad(start.getMinutes())}-${pad(end.getHours())}:${pad(end.getMinutes())}`
}

function calculateShiftDuration(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return Math.round(diffHours * 10) / 10
}

function getGroupColor(groupId: string, allGroupIds: string[]) {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'bg-gradient-to-r from-green-500 to-green-600 text-white',
    'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
  ]
  const index = allGroupIds.indexOf(groupId) % colors.length
  return colors[index]
}

function getPointsDisplay(points: number) {
  if (points >= 50) return { icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  if (points >= 30) return { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' }
  if (points >= 15) return { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' }
  return { icon: Star, color: 'text-green-600', bg: 'bg-green-50' }
}

function getStatusDisplay(status: ShiftStatus) {
  switch (status) {
    case ShiftStatus.Finished:
      return { 
        icon: CheckCircle, 
        color: 'text-green-600', 
        bg: 'bg-green-50', 
        text: 'הושלם',
        border: 'border-green-200'
      }
    case ShiftStatus.Active:
      return { 
        icon: PlayCircle, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50', 
        text: 'פעיל',
        border: 'border-blue-200'
      }
    case ShiftStatus.Cancelled:
      return { 
        icon: XCircle, 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        text: 'בוטל',
        border: 'border-red-200'
      }
    default:
      return { 
        icon: Calendar, 
        color: 'text-gray-600', 
        bg: 'bg-gray-50', 
        text: 'לא ידוע',
        border: 'border-gray-200'
      }
  }
}

export const ShiftHistoryGrid = ({ shifts, currentUserId }: ShiftHistoryGridProps) => {
  if (shifts.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="py-16">
          <div className="text-center">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">אין משמרות להצגה</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              לא נמצאו משמרות שהושלמו בטווח התאריכים שנבחר. נסה לשנות את הסינון או לבדוק תאריכים אחרים.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get unique groupIds for consistent coloring
  const uniqueGroupIds = Array.from(new Set(shifts.map((shift) => shift.groupId)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">היסטוריית משמרות</h2>
        <span className="text-sm text-gray-500">{shifts.length} משמרות</span>
      </div>
      
      <div className="space-y-4">
        {shifts.map(shift => {
          const start = new Date(shift.startDate)
          const end = new Date(shift.endDate)
          const duration = calculateShiftDuration(start, end)
          const isAssigned = currentUserId ? shift.users.includes(currentUserId) : false
          const pointsDisplay = getPointsDisplay(shift.points)
          const statusDisplay = getStatusDisplay(shift.status)
          const PointsIcon = pointsDisplay.icon
          const StatusIcon = statusDisplay.icon
          
          return (
            <div key={shift.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                {/* Header - Shift name and badges */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex-shrink-0">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
                      {shift.displayName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      className={`text-xs font-semibold px-2 py-1 ${getGroupColor(shift.groupId, uniqueGroupIds)}`}
                    >
                      {shift.groupName || shift.groupId}
                    </Badge>
                    <Badge className={`text-xs font-semibold px-2 py-1 ${statusDisplay.bg} ${statusDisplay.color} ${statusDisplay.border}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusDisplay.text}
                    </Badge>
                  </div>
                </div>
                
                {/* Details - Date, time, duration */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium truncate">
                      {start.toLocaleDateString('he-IL', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded flex-shrink-0">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{formatTimeRange(start, end)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{duration} שעות</span>
                  </div>
                </div>

                {/* Footer - Points and timestamp */}
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${pointsDisplay.bg} self-start`}>
                    <PointsIcon className={`w-4 h-4 ${pointsDisplay.color}`} />
                    <span className={`text-base font-bold ${pointsDisplay.color}`}>+{shift.points}</span>
                    <span className="text-xs text-gray-500 font-medium">נקודות</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 justify-start">
                    <Clock className="w-3 h-3" />
                    לפני {formatDistanceToNow(start, { addSuffix: true, locale: he })}
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Original Design */}
              <div className="hidden sm:block">
                <div className="flex items-center justify-between">
                  {/* Left side - Shift info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {shift.displayName}
                        </h3>
                      </div>
                      <Badge 
                        className={`text-xs font-semibold px-3 py-1 ${getGroupColor(shift.groupId, uniqueGroupIds)}`}
                      >
                        {shift.groupName || shift.groupId}
                      </Badge>
                      <Badge className={`text-xs font-semibold px-3 py-1 ${statusDisplay.bg} ${statusDisplay.color} ${statusDisplay.border}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusDisplay.text}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">
                          {start.toLocaleDateString('he-IL', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-100 rounded">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{formatTimeRange(start, end)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-indigo-100 rounded">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{duration} שעות</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Points and metadata */}
                  <div className="text-right ml-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${pointsDisplay.bg} mb-3`}>
                      <PointsIcon className={`w-5 h-5 ${pointsDisplay.color}`} />
                      <span className={`text-lg font-bold ${pointsDisplay.color}`}>+{shift.points}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mb-1">נקודות שהושגו</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      לפני {formatDistanceToNow(start, { addSuffix: true, locale: he })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 