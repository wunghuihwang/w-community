import { CommentPayload, UpdateCommentPayload } from '@/types';
import { createBrowserClient } from '@supabase/ssr';

export const getPosts = async (page = 1, limit = 10, category = 'all') => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('posts')
        .select('*, profiles:user_id(username, avatar_url)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        posts: data,
        totalCount: count || 0,
    };
};
export const getPostById = async (id: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      *,
      profiles:user_id (username, avatar_url)
    `,
        )
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const getTrendingPosts = async () => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:user_id (username, avatar_url)')
        .gte('like_count', 10)
        .order('like_count', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
};

export const createPost = async (post: {
    title: string;
    content: string;
    images: string[] | null;
    user_id: string;
    category: string;
}) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase.from('posts').insert(post).select().single();

    if (error) throw error;
    return data;
};

export const updatePost = async ({
    id,
    title,
    content,
    images,
    category,
}: {
    id: string;
    title: string;
    content: string;
    images: string[];
    category: string;
}) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
        .from('posts')
        .update({
            title,
            content,
            images,
            updated_at: new Date().toISOString(),
            category,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};
export const deletePost = async (id: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;
};

export const getComments = async (postId: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
        .from('comments')
        .select(
            `
        *,
        profiles!comments_user_id_fkey (
            username,
            avatar_url
        )
    `,
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
};

export const createComment = async ({ content, post_id }: CommentPayload) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    // - post_id: string
    // - user_id: string
    // - content: string (1~1000자)

    const { data, error } = await supabase
        .from('comments')
        .insert([{ user_id: user.id, content, post_id }])
        .select(
            `
        *,
        profiles!comments_user_id_fkey (
            username,
            avatar_url
        )
    `,
        )
        .single();
    if (error) throw error;

    return data;
};

export const updateComment = async ({ id: commentId, content }: UpdateCommentPayload) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    if (!content.trim() || content.length > 1000) {
        throw new Error('댓글은 1~1000자 사이여야 합니다.');
    }

    const { data, error } = await supabase
        .from('comments')
        .update({
            content: content.trim(),
        })
        .eq('id', commentId)
        .eq('user_id', user.id)
        .select();
    return data;
};

export const deleteComment = async (commentId: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id);
    if (error) throw error;
};
