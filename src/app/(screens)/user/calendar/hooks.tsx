import { getRequestsByUserId, deleteRequest } from "@/app/api/user/requests/functions";
import { getAllShiftsForUser } from "@/app/api/user/shifts/functions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/hooks/use-toast";

export const useGetUserRequests = (userId: string) => {
    return useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequestsByUserId(userId),
    })
};

export const useGetUserShifts = (userId: string) => {
    return useQuery({
        queryKey: ['shifts'],
        queryFn: () => getAllShiftsForUser(userId),
    })
};

export const useDeleteRequest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: deleteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast({
                title: "הבקשה נמחקה",
                description: "הבקשה נמחקה בהצלחה",
            });
        },
        onError: () => {
            toast({
                title: "שגיאה",
                description: "לא הצלחנו למחוק את הבקשה",
                variant: "destructive",
            });
        },
    });
};