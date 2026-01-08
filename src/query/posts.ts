import {
    checkIfLiked,
    createComment,
    createLike,
    createPost,
    deleteComment,
    deleteLike,
    deletePost,
    getComments,
    getPostById,
    getPosts,
    getTrendingPosts,
    updateComment,
    updatePost,
} from '@/lib/supabase/posts';
import { CommentPayload, UpdateCommentPayload } from '@/types';
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
        mutationFn: ({
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
        mutationFn: (id: string) => deletePost(id),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useCommentList = (postId: string) => {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => getComments(postId),
        enabled: !!postId,
    });
};

export const usePostComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ content, post_id }: CommentPayload) => createComment({ content, post_id }),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id: commentId, content }: UpdateCommentPayload) => updateComment({ id: commentId, content }),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};
export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};

// query/posts.ts

export const useCheckLike = (postId: string) => {
    return useQuery({
        queryKey: ['likes', postId],
        queryFn: () => checkIfLiked(postId),
        enabled: !!postId,
    });
};

export const useUpdateLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => createLike(postId),
        onSuccess: (data, postId) => {
            queryClient.invalidateQueries({ queryKey: ['likes', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts', postId] });
            queryClient.invalidateQueries({ queryKey: ['trending-posts', postId] });
        },
    });
};

export const useDeleteLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => deleteLike(postId),
        onSuccess: (data, postId) => {
            queryClient.invalidateQueries({ queryKey: ['likes', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts', postId] });
            queryClient.invalidateQueries({ queryKey: ['trending-posts', postId] });
        },
    });
};
