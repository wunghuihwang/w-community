// src/store/usePostsStore.ts
import { Comment, Post, PostFilter } from '@/types';
import { create } from 'zustand';

// 초기 데이터
const INITIAL_POST: Post = {
    id: '',
    user_id: '',
    title: '',
    content: '',
    category: '',
    images: null,
    like_count: 0,
    comment_count: 0,
    view_count: 0,
    created_at: '',
    updated_at: '',
    profiles: {
        username: '',
        avatar_url: null,
    },
};

interface PostsState {
    filterParams: PostFilter;
    post: Post[];
    selectedPost: Post;
    commentList: Comment[] | null;
    setFilterParams: (filterParams: PostFilter) => void;
    setPost: (post: Post[]) => void;
    setSelectedPost: (post: Post) => void;
    setCommentList: (commentList: Comment[]) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    post: [INITIAL_POST],
    selectedPost: INITIAL_POST,
    filterParams: {
        page: 1,
        limit: 5,
        category: 'all',
    },
    commentList: null,
    setPost: (post) => set({ post }),
    setSelectedPost: (selectedPost) => set({ selectedPost }),
    setFilterParams: (filterParams) => set({ filterParams }),
    setCommentList: (commentList) => set({ commentList }),
}));
