import { User } from "@/app/shared/types"
import { Archive, Clock } from "lucide-react"

interface ShiftHistoryHeaderProps {
  user: User
  totalShifts: number
}

export const ShiftHistoryHeader = ({ user, totalShifts }: ShiftHistoryHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Archive className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">היסטוריית משמרות</h1>
            <p className="text-gray-600">שלום {user.name}, הנה היסטוריית המשמרות שלך</p>
          </div>
        </div>
      </div>
    </div>
  )
} 