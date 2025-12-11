export type Post = {
    id: number;
    author: string;
    time: string;
    title: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    views: number;
};
export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string;
    };
}

export interface Profile {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
    created_at: string;
}
