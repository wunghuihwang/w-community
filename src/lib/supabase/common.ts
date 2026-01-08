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

// 읽지 않은 알림 개수
export async function getUnreadCount() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

    if (error) {
        console.error('읽지 않은 알림 개수 조회 실패:', error);
        return 0;
    }

    return count || 0;
}

// 알림 개별 읽기
export async function markNotificationAsRead(notificationId: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('로그인이 필요합니다');

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

    if (error) throw error;
    return { success: true };
}

// 알림 모두 읽기
export async function markAllNotificationsAsRead() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.rpc('mark_all_notifications_as_read');

    if (error) throw error;
    return { success: true };
}
