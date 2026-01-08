import { getNotis, getUnreadCount, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/supabase/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// export const usePostList = ({ page, limit, category }: { page: number; limit: number; category: string }) => {
//     return useQuery({
//         queryKey: ['posts', page, limit, category],
//         queryFn: () => getPosts(page, limit, category),
//     });
// };

export const useNotiList = (id: string) => {
    return useQuery({
        queryKey: ['notis', id],
        queryFn: () => getNotis(id),
        enabled: !!id,
    });
};

// 읽지 않은 알림 개수
export const useUnreadCount = () => {
    return useQuery({
        queryKey: ['notis'],
        queryFn: () => getUnreadCount(),
    });
};

// 알림 개별 읽기
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notis'] });
        },
    });
};

// 알림 모두 읽기
export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notis'] });
        },
    });
};
