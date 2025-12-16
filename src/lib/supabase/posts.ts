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
        id,
        post_id,
        user_id,
        content,
        created_at,
        updated_at,
        profiles (
            username,
            avatar_url
        )
    `,
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;

    // 배열을 단일 객체로 변환
    const transformedData = data?.map((comment) => ({
        ...comment,
        profiles:
            Array.isArray(comment.profiles) && comment.profiles.length > 0
                ? comment.profiles[0]
                : { username: 'Unknown', avatar_url: null },
    }));

    return transformedData;
};
