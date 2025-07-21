"use client"

import { useUser } from "@/app/contexts/UserContext"
import { useUserGroups } from "@/app/shared/hooks"
import { useGetUserShifts, useGetCompletedShiftsStats } from "./hooks/shiftHistoryHooks"
import { useState, useMemo } from "react"
import { ShiftHistoryHeader, ShiftHistoryFilters, ShiftHistoryGrid, ShiftHistoryStats } from "./components"
import { LoadingSpinner } from "@/app/components"

import { ShiftStatus } from "@/app/shared/types/enums"

export default function ShiftHistoryPage() {
  const { user } = useUser()
  const { data: userGroups, isLoading: userGroupsLoading } = useUserGroups(user)
  const { data: shifts, isLoading: shiftsLoading } = useGetUserShifts(user?.id || "")
  const { data: stats, isLoading: statsLoading } = useGetCompletedShiftsStats(user?.id || "")
  
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filter shifts based on selected criteria
  const filteredShifts = useMemo(() => {
    if (!shifts) return []

    return shifts.filter(shift => {
      const shiftDate = new Date(shift.startDate)
      const now = new Date()
      
      // Filter by group
      if (selectedGroup !== "all" && shift.groupId !== selectedGroup) {
        return false
      }

      // Filter by status
      if (selectedStatus !== "all") {
        switch (selectedStatus) {
          case "finished":
            if (shift.status !== ShiftStatus.Finished) return false
            break
          case "active":
            if (shift.status !== ShiftStatus.Active) return false
            break
          case "cancelled":
            if (shift.status !== ShiftStatus.Cancelled) return false
            break
        }
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const searchTermLower = searchTerm.trim().toLowerCase()
        const shiftNameLower = shift.displayName.toLowerCase()
        
        // Simple contains search
        if (!shiftNameLower.includes(searchTermLower)) {
          return false
        }
      }

      // Filter by selected date
      if (selectedDate) {
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        const shiftDateOnly = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate())
        if (selectedDateOnly.getTime() !== shiftDateOnly.getTime()) {
          return false
        }
      }

      return true
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }, [shifts, selectedGroup, selectedStatus, searchTerm, selectedDate])

  // Calculate stats based on group and status filters only (not search)
  const statsShifts = useMemo(() => {
    if (!shifts) return []

    return shifts.filter(shift => {
      // Filter by group
      if (selectedGroup !== "all" && shift.groupId !== selectedGroup) {
        return false
      }

      // Filter by status
      if (selectedStatus !== "all") {
        switch (selectedStatus) {
          case "finished":
            if (shift.status !== ShiftStatus.Finished) return false
            break
          case "active":
            if (shift.status !== ShiftStatus.Active) return false
            break
          case "cancelled":
            if (shift.status !== ShiftStatus.Cancelled) return false
            break
        }
      }

      return true
    })
  }, [shifts, selectedGroup, selectedStatus])

  // Calculate additional stats (based on group/status filters only)
  const calculatedStats = useMemo(() => {
    if (!statsShifts) return { totalHours: 0, completedShiftsCount: 0, totalPoints: 0 }
    
    const totalHours = statsShifts.reduce((total, shift) => {
      const start = new Date(shift.startDate)
      const end = new Date(shift.endDate)
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0)

    const totalPoints = statsShifts.reduce((total, shift) => total + shift.pointsPerHour, 0)

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      completedShiftsCount: statsShifts.length,
      totalPoints
    }
  }, [statsShifts])

  // Get groups for filter dropdown (exclude admin groups)
  const groups = [
    { value: "all", label: "כל הקבוצות" },
    ...((userGroups || [])
      .filter(g => user?.groups.some(ug => ug.groupId === g.id && !ug.isAdmin) || false)
      .map(g => ({
        value: g.id,
        label: g.displayName
      }))
    )
  ]

  // Handle loading state
  if (userGroupsLoading || shiftsLoading || statsLoading) {
    return <LoadingSpinner size="lg" fullPage />
  }

  // Handle no user state
  if (!user) {
    return <div>עליך להתחבר כדי לצפות בהיסטוריית המשמרות</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      <ShiftHistoryHeader 
        user={user} 
        totalShifts={calculatedStats.completedShiftsCount}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <ShiftHistoryStats stats={calculatedStats} />
        
        <ShiftHistoryFilters
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        
        <ShiftHistoryGrid shifts={filteredShifts} currentUserId={user.id} />
      </div>
    </div>
  )
} 