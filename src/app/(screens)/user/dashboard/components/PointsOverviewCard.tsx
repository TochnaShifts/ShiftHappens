"use client"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card"
import { Button } from "@/app/components/loveable/button"
import { UserGroupPoints } from "@/app/shared/types/models"

export const PointsOverviewCard = ({ pointsData }: { pointsData: { groupId: string; groupName: string; count: number }[] }) => (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center"><BarChart3 className="w-5 h-5 ml-2 text-green-600" />סקירת נקודות</CardTitle>
      <CardDescription>הנקודות שלך בכל הקבוצות</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {pointsData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{item.groupName}</span>
              <div className="text-left">
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
                <span className="text-sm text-gray-500 mr-1">נק'</span>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (item.count / 150) * 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4">צפה בפירוט מלא</Button>
    </CardContent>
  </Card>
)