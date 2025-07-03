import { createRequest, getRequestsByUserId } from "@/app/api/user/requests/functions";
import { toast } from "@/app/components/loveable/use-toast";
import { queryKeys } from "@/app/shared/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.requests})
            toast({
                title: "בקשה נוצרה בהצלחה",
                description: "הבקשה נוצרה בהצלחה",
            })
        }
    })
}

export const useGetUserRequests = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.requests,
        queryFn: () => getRequestsByUserId(userId),
    })
}