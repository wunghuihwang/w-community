import { getPosts } from '@/lib/supabase/posts';
import { useQuery } from '@tanstack/react-query';

export const usePostList = ({ page, limit, category }: { page: number; limit: number; category: string }) => {
    return useQuery({
        queryKey: ['posts', page, limit, category],
        queryFn: () => getPosts(page, limit, category),
    });
};
