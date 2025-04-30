import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();

    const { data: activities, isPending } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
            console.log('Fetching all activities');
            const response = await agent.get<Activity[]>('/activities');
            console.log('All activities:', response.data);
            return response.data;
        }
    });

    const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            console.log(`Fetching activity with id: ${id}`);
            const response = await agent.get<Activity>(`/activities/${id}`);
            console.log('Activity data:', response.data);
            return response.data;
        },
        enabled: !!id
    });

    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            console.log('Updating activity:', activity);
            await agent.put('/activities', activity);
        },
        onSuccess: async () => {
            console.log('Activity updated successfully');
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    });

    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post('/activities', activity);
            return response.data;
        },
        onSuccess: async () => {
            console.log('Activity created successfully');
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    });

    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            console.log(`Deleting activity with id: ${id}`);
            await agent.delete(`/activities/${id}`);
        },
        onSuccess: async () => {
            console.log('Activity deleted successfully');
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    });

    console.log('useActivities hook:', { activities, isPending, activity, isLoadingActivity });

    return {
        activities,
        isPending,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity
    };
};
