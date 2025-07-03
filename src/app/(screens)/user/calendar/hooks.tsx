import { getRequestsByUserId } from "@/app/api/user/requests/functions";
import { getAllShiftsForUser } from "@/app/api/user/shifts/functions";
import { useQuery } from "@tanstack/react-query";

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