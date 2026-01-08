import { createBrowserClient } from '@supabase/ssr';

// 게시글 목록 조회 (좋아요 정보 포함)
export async function getPosts(page: number, limit: number, category: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('posts')
        .select(
            `
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      likes (
        user_id
      )
    `,
            { count: 'exact' },
        )
        .order('created_at', { ascending: false })
        .range(from, to);

    // 카테고리 필터링
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // 각 게시글에 isLiked 정보 추가
    const postsWithLikeStatus = data?.map((post) => ({
        ...post,
        isLiked: user ? post.likes.some((like: any) => like.user_id === user.id) : false,
    }));

    return {
        posts: postsWithLikeStatus || [],
        total: count || 0,
        hasMore: count ? from + limit < count : false,
    };
}

// 게시글 상세 조회 (좋아요 정보 포함)
export async function getPostById(id: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      *,
      profiles:user_id (
        id,
        username,
        avatar_url,
        bio
      ),
      likes (
        user_id
      )
    `,
        )
        .eq('id', id)
        .single();

    if (error) throw error;

    // isLiked 정보 추가
    const postWithLikeStatus = {
        ...data,
        isLiked: user ? data.likes.some((like: any) => like.user_id === user.id) : false,
    };

    return postWithLikeStatus;
}

// 인기 게시글 조회 (좋아요 정보 포함)
export async function getTrendingPosts() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('posts')
        .select(
            `
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      ),
      likes (
        user_id
      )
    `,
        )
        .gte('like_count', 10)
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) throw error;

    const postsWithLikeStatus = data?.map((post) => ({
        ...post,
        isLiked: user ? post.likes.some((like: any) => like.user_id === user.id) : false,
    }));

    return postsWithLikeStatus || [];
}

// 게시글 생성
export async function createPost(post: {
    title: string;
    content: string;
    images: string[] | null;
    user_id: string;
    category: string;
}) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase.from('posts').insert(post).select().single();

    if (error) throw error;
    return data;
}

// 게시글 수정
export async function updatePost(post: {
    id: string;
    title: string;
    content: string;
    images: string[];
    category: string;
}) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from('posts')
        .update({
            title: post.title,
            content: post.content,
            images: post.images,
            category: post.category,
        })
        .eq('id', post.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// 게시글 삭제
export async function deletePost(id: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
}

// 댓글 목록 조회
export async function getComments(postId: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from('comments')
        .select(
            `
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      )
    `,
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// 댓글 작성
export async function createComment(comment: { content: string; post_id: string }) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('로그인이 필요합니다');
    }

    const { data, error } = await supabase
        .from('comments')
        .insert({
            ...comment,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// 댓글 수정
export async function updateComment(comment: { id: string; content: string }) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
        .from('comments')
        .update({ content: comment.content })
        .eq('id', comment.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// 댓글 삭제
export async function deleteComment(id: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.from('comments').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
}

// 좋아요 추가
export async function createLike(postId: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('로그인이 필요합니다');
    }

    const { data, error } = await supabase
        .from('likes')
        .insert({
            post_id: postId,
            user_id: user.id,
        })
        .select()
        .single();
    console.log(data);
    if (error) {
        if (error.code === '23505') {
            throw new Error('이미 좋아요를 눌렀습니다');
        }
        throw error;
    }

    return data;
}

// 좋아요 취소
export async function deleteLike(postId: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('로그인이 필요합니다');
    }
    const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
}

// 좋아요 상태 확인
export async function checkIfLiked(postId: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return false;
    }

    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
    console.log(data);
    if (error) {
        console.error('좋아요 상태 확인 실패:', error);
        return false;
    }

    return !!data;
}
