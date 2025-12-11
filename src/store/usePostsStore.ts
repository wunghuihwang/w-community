import { Post } from '@/types';
import { create } from 'zustand';

const POSTS_DATA = {
    id: 0,
    author: '',
    time: '',
    title: '',
    content: '',
    image: '',
    likes: 0,
    comments: 0,
    views: 0,
};

interface PostsState {
    selectedPost: Post;
    setSelectedPost: (user: Post) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    selectedPost: POSTS_DATA,
    setSelectedPost: (selectedPost) => set({ selectedPost }),
}));
