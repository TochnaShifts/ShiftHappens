"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { Input } from "@/app/components/loveable/input";
import { Label } from "@/app/components/loveable/label";
import { Textarea } from "@/app/components/loveable/textarea";
import { Select, SelectItem } from "@/app/components/loveable/select";
import { CirclePlus } from "lucide-react";
import { useToast } from "@/app/hooks/use-toast";
import { createRequest } from "@/app/api/user/requests/functions";
import { RequestType, User } from "@/app/shared/types";
import { requestInitialState } from "@/app/shared/types/api";
import {
  requestFormSchema,
  RequestFormZod,
} from "@/app/shared/types/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorRequestToast, successRequestToast } from "@/app/shared/utils/toastUtilsl";
import { DatePickerInput } from "@/app/components/ori/form/DatePickerInput";
import { v4 as uuidv4 } from 'uuid';
import { useCreateRequest } from "./hooks";

interface RequestFormProps {
  user: User;
}

const initialNewRequest = (user: User, request: RequestFormZod) => ({
  id: "",
  userId: user.id,
  startDate: new Date(request.startDate),
  endDate: new Date(request.endDate),
  type: Number(request.type),
  description: request.description || "",
  createdAt: new Date(),
});

export const RequestForm: React.FC<RequestFormProps> = ({ user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { mutate: createRequest } = useCreateRequest();

  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<RequestFormZod>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: requestInitialState,
  });


  const onSubmit = async (data: RequestFormZod) => {
    setLoading(true);
    try {

      createRequest(initialNewRequest(user, data));
      
      reset();
      toast({title: "הבקשה נשלחה", description: "הבקשה שלך נקלטה במערכת בהצלחה"});
    } catch (error) {
      toast({title: "שגיאה", description: "לא הצלחנו לשלוח את הבקשה", variant: "destructive"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          הגש בקשה חדשה
        </CardTitle>
        <CardDescription>
          ספר לנו על העדפות או אילוצי הזמינות שלך
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">סוג הבקשה</Label>
            <Select
              {...register("type")}
              defaultValue=""
              placeholder="בחר סוג בקשה"
            >
              <SelectItem value={RequestType.Exclude}>
                לא יכול (הסתייגות)
              </SelectItem>
              <SelectItem value={RequestType.Prefer}> יכול (העדפה)</SelectItem>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 ">
              <DatePickerInput
                name="startDate"
                control={control}
                label="תאריך התחלה"
                error={errors.startDate?.message}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <DatePickerInput
                name="endDate"
                control={control}
                label="תאריך סיום"
                error={errors.endDate?.message}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="ספק פרטים נוספים על הבקשה שלך..."
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            disabled={loading}
          >
            {loading ? "שולח..." : "שלח בקשה"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
