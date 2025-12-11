export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    images: string[];
    like_count: number;
    view_count: number;
    created_at: string;
    updated_at: string;
    profiles: {
        username: string;
        avatar_url: string;
    };
}

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
