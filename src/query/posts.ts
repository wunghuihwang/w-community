import {
    createPost,
    deletePost,
    getComments,
    getPostById,
    getPosts,
    getTrendingPosts,
    updatePost,
} from '@/lib/supabase/posts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// export const usePostList = ({ page, limit, category }: { page: number; limit: number; category: string }) => {
//     return useQuery({
//         queryKey: ['posts', page, limit, category],
//         queryFn: () => getPosts(page, limit, category),
//     });
// };

export const usePostList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ page, limit, category }: { page: number; limit: number; category: string }) =>
            getPosts(page, limit, category),

        onSuccess: (success) => {
            console.log('create post success:', success);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },

        onError: (error) => {
            console.error('create post failed:', error);
        },
    });
};
export const useSelectPost = (id: string) => {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => getPostById(id),
        enabled: !!id,
    });
};
export const useTrendingPost = () => {
    return useQuery({
        queryKey: ['trending-posts'],
        queryFn: () => getTrendingPosts(),
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            post,
        }: {
            post: { title: string; content: string; images: string[] | null; user_id: string; category: string };
        }) => createPost(post),

        onSuccess: (success) => {
            console.log('create post success:', success);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },

        onError: (error) => {
            console.error('create post failed:', error);
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            post,
        }: {
            post: {
                id: string;
                title: string;
                content: string;
                images: string[];
                category: string;
            };
        }) =>
            updatePost({
                id: post.id,
                title: post.title,
                content: post.content,
                images: post.images,
                category: post.category,
            }),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => deletePost(id),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useCommentList = (postId: string) => {
    return useQuery({
        queryKey: ['posts', 'comments'],
        queryFn: () => getComments(postId),
        enabled: !!postId,
    });
};
