'use client'

import { RequestList } from "./RequestList";
import { RequestForm } from "./RequestForm";
import { FileText } from "lucide-react";
import { RequestsHelpSection } from "./RequestsHelpSection";
import { useUser } from "@/app/contexts/UserContext";
import { queryKeys } from "@/app/shared/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getRequestsByUserId } from "@/app/api/user/requests/functions";
import { useGetUserRequests } from "./hooks";

export default function RequestsPage() {
  const { user } = useUser();
  const { data: requests } = useGetUserRequests(user?.id || "");
  if (!user) {
    return <div>עליך להתחבר כדי לצפות בבקשות</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
         <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">בקשות זמינות</h1>
              <p className="text-sm text-gray-600">הגש בקשה חדשה</p>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <RequestForm user={user} />
          <RequestList requests={requests || []} />
        </div>
        <RequestsHelpSection />
      </div>
    </div>
  );
}