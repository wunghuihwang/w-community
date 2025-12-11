// ============================================
// 📚 W Community API 사용 가이드
// ============================================

// ============================================
// 1️⃣ 게시글 (Posts)
// ============================================

// 📖 게시글 목록 가져오기
const getPosts = async ({ page, limit, category }) => {
// 파라미터:
// - page: number (기본값: 1)
// - limit: number (기본값: 10)
// - category: 'all' | 'development' | 'design' | 'business'

// 반환값:
// {
// posts: Post[],
// totalCount: number
// }
}

// 📖 게시글 상세 가져오기
const getPostById = async (id: string) => {
// 파라미터:
// - id: string (게시글 ID)

// 반환값: Post 객체
// {
// id, user_id, title, content, images[],
// category, like_count, comment_count, view_count,
// created_at, updated_at,
// profiles: { username, avatar_url, bio }
// }
}

// 🔥 인기 게시글 가져오기
const getTrendingPosts = async () => {
// 파라미터: 없음
// 조건: like_count >= 10
// 정렬: like_count 내림차순
// 개수: 10개
}

// ✍️ 게시글 작성
const createPost = async (data) => {
// 필수:
// - title: string (1~200자)
// - content: string (1자 이상)
// - user_id: string

// 선택:
// - images: string[] (기본값: [])
// - category: string (기본값: 'development')
}

// ✏️ 게시글 수정
const updatePost = async (id: string, data) => {
// 수정 가능 항목:
// - title: string
// - content: string
// - images: string[]
// - category: string

// 주의: user_id가 본인이어야 함
}

// 🗑️ 게시글 삭제
const deletePost = async (id: string) => {
// 파라미터: id
// 주의: user_id가 본인이어야 함
}

// ============================================
// 2️⃣ 댓글 (Comments)
// ============================================

// 📖 댓글 목록 가져오기
const getComments = async (postId: string) => {
// 파라미터:
// - postId: string

// 반환값: Comment[]
// {
// id, post_id, user_id, content,
// created_at, updated_at,
// profiles: { username, avatar_url }
// }
}

// ✍️ 댓글 작성
const createComment = async (data) => {
// 필수:
// - post_id: string
// - user_id: string
// - content: string (1~1000자)
}

// 🗑️ 댓글 삭제
const deleteComment = async (id: string) => {
// 파라미터: id
// 주의: user_id가 본인이어야 함
}

// ============================================
// 3️⃣ 좋아요 (Likes)
// ============================================

// ❤️ 좋아요 상태 확인
const checkLikeStatus = async (postId: string, userId: string) => {
// 파라미터:
// - postId: string
// - userId: string

// 반환값: boolean (true면 이미 좋아요 누름)
}

// ❤️ 좋아요 추가
const addLike = async (data) => {
// 필수:
// - post_id: string
// - user_id: string

// 주의: 중복 불가 (UNIQUE 제약조건)
}

// 💔 좋아요 취소
const removeLike = async (postId: string, userId: string) => {
// 파라미터:
// - postId: string
// - userId: string
}

// ============================================
// 4️⃣ 프로필 (Profiles)
// ============================================

// 📖 프로필 가져오기
const getProfile = async (userId: string) => {
// 파라미터:
// - userId: string

// 반환값:
// {
// id, username, avatar_url, bio, email,
// created_at, updated_at
// }
}

// 📖 내 게시글 가져오기
const getMyPosts = async (userId: string) => {
// 파라미터:
// - userId: string

// 반환값: Post[]
}

// ✏️ 프로필 수정
const updateProfile = async (userId: string, data) => {
// 수정 가능 항목:
// - username: string (2~30자, 유니크)
// - bio: string (최대 500자)
// - avatar_url: string
// - email: string

// 주의: userId가 본인이어야 함
}

// ============================================
// 5️⃣ 알림 (Notifications)
// ============================================

// 📖 알림 목록 가져오기
const getNotifications = async (userId: string) => {
// 파라미터:
// - userId: string

// 반환값: Notification[] (최근 50개)
// {
// id, user_id, sender_id, type, post_id,
// content, read, created_at,
// sender: { username, avatar_url }
// }
// type: 'like' | 'comment' | 'follow'
}

// ✅ 알림 읽음 처리
const markAsRead = async (id: string) => {
// 파라미터: id
// 업데이트: read = true
}

// ✅ 모든 알림 읽음 처리
const markAllAsRead = async (userId: string) => {
// 파라미터: userId
// 업데이트: read = false인 것들만 true로
}

// ============================================
// 6️⃣ 이미지 업로드 (Storage)
// ============================================

// 📤 아바타 이미지 업로드
const uploadAvatar = async (file: File, userId: string) => {
// 버킷: 'avatars'
// 경로: `${userId}/${timestamp}-${filename}`
// 반환: 이미지 URL

const filePath = `${userId}/${Date.now()}-${file.name}`
const { data, error } = await supabase.storage
.from('avatars')
.upload(filePath, file)

// URL 생성
const { data: { publicUrl } } = supabase.storage
.from('avatars')
.getPublicUrl(filePath)

return publicUrl
}

// 📤 게시글 이미지 업로드
const uploadPostImage = async (file: File, userId: string) => {
// 버킷: 'post-images'
// 경로: `${userId}/${timestamp}-${filename}`
// 반환: 이미지 URL

const filePath = `${userId}/${Date.now()}-${file.name}`
const { data, error } = await supabase.storage
.from('post-images')
.upload(filePath, file)

const { data: { publicUrl } } = supabase.storage
.from('post-images')
.getPublicUrl(filePath)

return publicUrl
}

// ============================================
// 📊 실제 사용 예시
// ============================================

// 예시 1: 게시글 목록 불러오기
const { data } = await supabase
.from('posts')
.select('\*, profiles:user_id(username, avatar_url)')
.eq('category', 'development')
.order('created_at', { ascending: false })
.range(0, 9) // 0~9번째 = 10개

// 예시 2: 게시글 작성
const { data } = await supabase
.from('posts')
.insert([{
user_id: '유저ID',
title: '제목',
content: '내용',
category: 'development',
images: ['이미지URL1', '이미지URL2']
}])
.select()
.single()

// 예시 3: 게시글 수정
const { data } = await supabase
.from('posts')
.update({
title: '새 제목',
content: '새 내용'
})
.eq('id', '게시글ID')
.select()
.single()

// 예시 4: 댓글 작성
const { data } = await supabase
.from('comments')
.insert([{
post_id: '게시글ID',
user_id: '유저ID',
content: '댓글 내용'
}])
.select()
.single()

// 예시 5: 좋아요 추가
const { data } = await supabase
.from('likes')
.insert([{
post_id: '게시글ID',
user_id: '유저ID'
}])

// 예시 6: 좋아요 취소
const { data } = await supabase
.from('likes')
.delete()
.eq('post_id', '게시글ID')
.eq('user_id', '유저ID')

// 예시 7: 프로필 수정
const { data } = await supabase
.from('profiles')
.update({
username: '새이름',
bio: '새 소개'
})
.eq('id', '유저ID')
.select()
.single()

// 예시 8: 알림 가져오기
const { data } = await supabase
.from('notifications')
.select('\*, sender:sender_id(username, avatar_url)')
.eq('user_id', '유저ID')
.order('created_at', { ascending: false })
.limit(50)

// ============================================
// ⚠️ 주의사항
// ============================================

/\*

1. RLS 정책으로 인해:
    - 본인 데이터만 수정/삭제 가능
    - auth.uid()가 user_id와 일치해야 함

2. 트리거로 자동 처리:
    - like_count: 좋아요 추가/삭제 시 자동 증감
    - comment_count: 댓글 추가/삭제 시 자동 증감
    - notifications: 좋아요/댓글 시 자동 생성

3. 제약 조건:
    - username: 2~30자, 유니크
    - title: 1~200자
    - content: 1자 이상
    - comment: 1~1000자
    - bio: 최대 500자
    - category: 'development' | 'design' | 'business' | 'other'

4. 조인 쿼리:
    - profiles 정보가 필요하면 select에 포함:
      .select('_, profiles:user_id(username, avatar_url)')
      _/
