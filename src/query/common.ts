import { getNotis } from '@/lib/supabase/common';
import { useQuery } from '@tanstack/react-query';

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
