"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { Badge } from "@/app/components/loveable/badge"
import { Shift } from "@/app/shared/types"
import { formatDistanceToNow } from "date-fns"
import { he } from "date-fns/locale"
import { Clock, MapPin, Star, Calendar, CheckCircle } from "lucide-react"

interface ShiftHistoryListProps {
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
    'bg-blue-50 border-blue-200 text-blue-800',
    'bg-green-50 border-green-200 text-green-800',
    'bg-purple-50 border-purple-200 text-purple-800',
    'bg-orange-50 border-orange-200 text-orange-800',
    'bg-pink-50 border-pink-200 text-pink-800',
    'bg-indigo-50 border-indigo-200 text-indigo-800',
  ]
  const index = allGroupIds.indexOf(groupId) % colors.length
  return colors[index]
}

export const ShiftHistoryList = ({ shifts, currentUserId }: ShiftHistoryListProps) => {
  if (shifts.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="py-12">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין משמרות להצגה</h3>
            <p className="text-gray-500">לא נמצאו משמרות שהושלמו בטווח התאריכים שנבחר</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get unique groupIds for consistent coloring
  const uniqueGroupIds = Array.from(new Set(shifts.map((shift) => shift.groupId)))

  // Group shifts by month
  const shiftsByMonth: { [key: string]: (Shift & { groupName?: string })[] } = {}
  shifts.forEach(shift => {
    const date = new Date(shift.startDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!shiftsByMonth[monthKey]) {
      shiftsByMonth[monthKey] = []
    }
    shiftsByMonth[monthKey].push(shift)
  })

  const sortedMonths = Object.keys(shiftsByMonth).sort().reverse()

  return (
    <div className="space-y-6">
      {sortedMonths.map(monthKey => {
        const monthShifts = shiftsByMonth[monthKey]
        const firstShift = monthShifts[0]
        const date = new Date(firstShift.startDate)
        
        return (
          <Card key={monthKey} className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">
                {date.toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: 'long'
                })}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {monthShifts.length} משמרות הושלמו החודש
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthShifts.map(shift => {
                  const start = new Date(shift.startDate)
                  const end = new Date(shift.endDate)
                  const duration = calculateShiftDuration(start, end)
                  const isAssigned = currentUserId ? shift.users.includes(currentUserId) : false
                  
                  return (
                    <div
                      key={shift.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                {shift.displayName}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className={getGroupColor(shift.groupId, uniqueGroupIds)}
                                >
                                  {shift.groupName || shift.groupId}
                                </Badge>
                                {isAssigned && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    הושלם
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                +{shift.points}
                              </div>
                              <div className="text-sm text-gray-500">נקודות</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {start.toLocaleDateString('he-IL', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeRange(start, end)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Star className="w-4 h-4" />
                              <span>{duration} שעות</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            הושלם לפני {formatDistanceToNow(start, { addSuffix: true, locale: he })}
                          </span>
                          <span>מזהה: {shift.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 