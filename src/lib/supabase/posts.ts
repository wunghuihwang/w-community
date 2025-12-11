import useSupabaseBrowser from './supabase-browser';

export const supabase = useSupabaseBrowser();

export const getPosts = async (page = 1, limit = 10, category = 'developer') => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
        .from('posts')
        .select('\*, profiles:user_id(username, avatar_url)')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;
    return data;
};

export const getPostById = async (id: string) => {
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

export const createPost = async (post: { title: string; content: string; images: string[]; user_id: string }) => {
    const { data, error } = await supabase.from('posts').insert([post]).select().single();

    if (error) throw error;
    return data;
};

// export const updatePost = async (id: string, updates: Partial<Post>) => {
//     const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();

//     if (error) throw error;
//     return data;
// };

export const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;
};
