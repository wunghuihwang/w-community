import { Comment, Post } from '@/types';
import { create } from 'zustand';

const POSTS_DATA = {
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

interface useTrendingStore {
    post: Post[];
    selectedPost: Post;
    commentList: Comment[] | null;
    setPost: (post: Post[]) => void;
    setSelectedPost: (user: Post) => void;
    setCommentList: (commentList: Comment[]) => void;
}

export const useTrendingStore = create<useTrendingStore>((set) => ({
    post: [POSTS_DATA],
    selectedPost: POSTS_DATA,
    commentList: null,
    setPost: (post) => set({ post }),
    setSelectedPost: (selectedPost) => set({ selectedPost }),
    setCommentList: (commentList) => set({ commentList }),
}));
