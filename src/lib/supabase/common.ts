import { CommentPayload, UpdateCommentPayload } from '@/types';
import { createBrowserClient } from '@supabase/ssr';

export const getNotis = async (user_id: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase
        .from('notifications')
        .select('\*, sender:sender_id(username, avatar_url)')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(50);

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
