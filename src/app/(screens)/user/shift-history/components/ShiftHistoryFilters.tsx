"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { Select, SelectItem } from "@/app/components/loveable/select"
import { Input } from "@/app/components/loveable/input"
import { DatePickerInput } from "@/app/components/ori/form/DatePickerInput"
import { useForm } from "react-hook-form"
import { Filter, Calendar, Users, Search, X, Sparkles } from "lucide-react"
import { Button } from "@/app/components/loveable/button"
import { generateSearchTerms } from "@/app/shared/utils/keyboardLayoutCorrection"

interface ShiftHistoryFiltersProps {
  groups: { value: string; label: string }[]
  selectedGroup: string
  setSelectedGroup: (group: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
}

interface FilterFormData {
  selectedDate: string
}

export const ShiftHistoryFilters = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus
}: ShiftHistoryFiltersProps) => {
  const { control, reset, watch } = useForm<FilterFormData>({
    defaultValues: {
      selectedDate: selectedDate?.toISOString() || ""
    }
  })

  // Watch for changes in the form and update parent state
  const watchedDate = watch("selectedDate")
  React.useEffect(() => {
    if (watchedDate) {
      setSelectedDate(new Date(watchedDate))
    } else {
      setSelectedDate(null)
    }
  }, [watchedDate, setSelectedDate])

  // Update form when selectedDate prop changes (for external updates)
  React.useEffect(() => {
    reset({
      selectedDate: selectedDate?.toISOString() || ""
    })
  }, [selectedDate, reset])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const resetFilters = () => {
    setSelectedDate(null)
    setSelectedGroup("all")
    setSelectedStatus("all")
    setSearchTerm("")
    reset({
      selectedDate: ""
    })
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md">
          <Filter className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">סינון וחיפוש מתקדם</h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            מצא את המשמרות שאתה מחפש עם חיפוש חכם
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Enhanced Search Bar */}
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש לפי שם משמרת..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full py-2 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-xl text-base shadow-sm ${searchTerm ? 'pl-12 pr-12' : 'pl-4 pr-12'}`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            חיפוש לפי שם משמרת
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enhanced Group Filter */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span>קבוצה</span>
            </label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-lg px-3 py-2.5 text-sm shadow-sm pr-10 cursor-pointer hover:border-gray-300"
              >
                {groups.map((group) => (
                  <option key={group.value} value={group.value} className="py-1">
                    {group.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Status Filter */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>סטטוס</span>
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 rounded-lg px-3 py-2.5 text-sm shadow-sm pr-10 cursor-pointer hover:border-gray-300"
              >
                <option value="all" className="py-1">כל המשמרות</option>
                <option value="finished" className="py-1">הושלמו</option>
                <option value="active" className="py-1">פעילות</option>
                <option value="cancelled" className="py-1">בוטלו</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Date Filter */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span>תאריך</span>
            </label>
            <DatePickerInput
              name="selectedDate"
              control={control}
              placeholder="בחר תאריך"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetFilters}
            size="sm"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-200 px-6 py-2 rounded-xl font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            נקה את כל הסינונים
          </Button>
        </div>
      </div>
    </div>
  )
} 