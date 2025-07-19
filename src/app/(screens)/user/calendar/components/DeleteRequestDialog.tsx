"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/loveable/alert-dialog";
import { Request, RequestType } from "@/app/shared/types";
import { LoadingSpinner } from "@/app/components";

interface DeleteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Request | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteRequestDialog: React.FC<DeleteRequestDialogProps> = ({
  open,
  onOpenChange,
  request,
  onConfirm,
  isLoading,
}) => {
  if (!request) return null;

  const getRequestTypeText = (type: RequestType) => {
    return type === RequestType.Exclude ? "הסתייגות" : "העדפה";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle dir="rtl">מחיקת בקשה</AlertDialogTitle>
          <AlertDialogDescription dir="rtl">
            האם אתה בטוח שברצונך למחוק {getRequestTypeText(request.type)} זו?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-2">
          <AlertDialogCancel disabled={isLoading}>ביטול</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <LoadingSpinner size="sm" />
                <span>מוחק...</span>
              </div>
            ) : (
              "מחק"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 