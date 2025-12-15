export interface PostProfile {
    username: string;
    avatar_url: string | null;
}

export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: string | null;
    images: string[] | null;
    like_count: number | null;
    comment_count: number | null;
    view_count: number | null;
    created_at: string | null;
    updated_at: string | null;
    profiles: PostProfile;
}

export interface PostFilter {
    page: number;
    limit: number;
    category: string;
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
