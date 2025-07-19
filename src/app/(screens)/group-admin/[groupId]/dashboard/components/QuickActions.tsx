import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { Plus, Calendar, Users, ClipboardList, Settings } from "lucide-react";
import Link from "next/link";
import { Group } from "@/app/shared/types";

interface QuickActionsProps {
  group: Group;
}

export const QuickActions = ({ group }: QuickActionsProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white mb-1">
              פעולות ניהול מהירות
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              ניהול קבוצת <span className="font-semibold">{group.displayName}</span>
            </CardDescription>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={`/group-admin/${group.id}/shifts/create`}>
            <Button className="w-full h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">יצירת משמרת</div>
              </div>
            </Button>
          </Link>

          <Link href={`/group-admin/${group.id}/shifts`}>
            <Button className="w-full h-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">ניהול משמרות</div>
              </div>
            </Button>
          </Link>

          <Link href={`/group-admin/${group.id}/users`}>
            <Button className="w-full h-20 bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">ניהול חברי קבוצה</div>
              </div>
            </Button>
          </Link>

          <Link href={`/group-admin/${group.id}/requests`}>
            <Button className="w-full h-20 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors">
                  <ClipboardList className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">בקשות חברי קבוצה</div>
              </div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}; 