"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/loveable/card";
import { Badge } from "@/app/components/loveable/badge";
import { Calendar, Clock } from "lucide-react";
import { Request, RequestType } from "@/app/shared/types";

interface RequestListProps {
  requests: Request[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

const getTypeLabel = (type: RequestType) => {
  return type === RequestType.Exclude ? "לא יכול (הסתייגות)" : "יכול (העדפה)";
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "submitted":
      return "נשלח";
    default:
      return status;
  }
};

const getTypeBadge = (type: RequestType) => {
  if (type === RequestType.Prefer) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-200 text-green-900 text-sm font-semibold shadow-sm border border-green-300">
        העדפה <span className="text-lg ml-1">👍</span>
      </span>
    );
  } else if (type === RequestType.Exclude) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-200 text-red-900 text-sm font-semibold shadow-sm border border-red-300">
        הסתייגות <span className="text-lg ml-1">🛑</span>
      </span>
    );
  }
  return null;
};

export const RequestList: React.FC<RequestListProps> = ({ requests }) => {
  const sortedRequests = [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 ml-2 text-green-600" />
          הבקשות שלך
        </CardTitle>
        <CardDescription>
          הבקשות שהגשת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 overflow-y-auto max-h-[500px]">
          {sortedRequests.map((request) => (
            <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getTypeLabel(request.type)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    הוגש ב-{new Date(request.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                {getTypeBadge(request.type)}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 ml-1" />
                {new Date(request.startDate).toLocaleDateString('he-IL')} - {new Date(request.endDate).toLocaleDateString('he-IL')}
              </div>
              {request.description && (
                <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                  {request.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestList; 