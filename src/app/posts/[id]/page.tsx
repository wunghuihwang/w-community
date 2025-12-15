'use client';

import { PostDetailActions } from '@/components/PostDetailsActions';
import { useSelectPost } from '@/query/posts';
import { usePostsStore } from '@/store/usePostsStore';
import { getRelativeTime } from '@/utills/common.utill';
import { motion } from 'framer-motion';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DetailPage = () => {
    const { selectedPost, setSelectedPost } = usePostsStore();
    const params = useParams();
    const [postId, setPostId] = useState<string>('');
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const { data: postData, isSuccess } = useSelectPost(postId);

    useEffect(() => {
        if (params.id) {
            setPostId(Array.isArray(params.id) ? params.id[0] : params.id);
        }
    }, [params.id]);

    useEffect(() => {
        if (postData) {
            setSelectedPost(postData);
        }
    }, [postData, setSelectedPost]);

    const mockComments = [
        { id: 1, author: 'UserA', content: '정말 유익한 정보네요! 감사합니다.', time: '1시간 전', avatar: null },
        { id: 2, author: 'UserB', content: '저도 이 방법으로 해봐야겠어요', time: '2시간 전', avatar: null },
    ];

    // 아바타 렌더링 함수
    const renderAvatar = (username: string, avatarUrl: string | null, size: 'small' | 'medium' = 'medium') => {
        const sizeClasses = size === 'small' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

        if (avatarUrl) {
            return (
                <div className={`${sizeClasses} rounded-full overflow-hidden border border-gray-300 shrink-0`}>
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            );
        }

        const firstChar = username?.charAt(0).toUpperCase() || '?';
        return (
            <div
                className={`${sizeClasses} bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold border border-gray-300 shrink-0`}
            >
                {firstChar}
            </div>
        );
    };

    if (!selectedPost) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
                <div className="text-gray-500">게시글을 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200 mb-6"
                >
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-3 mb-6">
                        {renderAvatar(selectedPost.profiles.username, selectedPost.profiles.avatar_url)}
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">{selectedPost.profiles.username}</div>
                            <div className="text-sm text-gray-500">{getRelativeTime(selectedPost.created_at)}</div>
                        </div>
                        <PostDetailActions postId={selectedPost.id} author={selectedPost.profiles.username} />
                    </div>

                    {/* 카테고리 */}
                    {selectedPost.category && selectedPost.category !== 'all' && (
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                {selectedPost.category}
                            </span>
                        </div>
                    )}

                    {/* 제목 */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">{selectedPost.title}</h1>

                    {/* 내용 */}
                    <div className="prose max-w-none mb-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedPost.content}
                    </div>

                    {/* 이미지들 */}
                    {selectedPost.images && selectedPost.images.length > 0 && (
                        <div className="mb-6 space-y-4">
                            {selectedPost.images.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={image}
                                        alt={`${selectedPost.title} - 이미지 ${index + 1}`}
                                        className="w-full"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            <span>{(selectedPost.like_count ?? 0) + (liked ? 1 : 0)}</span>
                        </motion.button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{selectedPost.comment_count ?? 0}</span>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-auto">
                            <Bookmark className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* 댓글 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg p-8 border border-gray-200"
                >
                    <h2 className="text-xl font-bold mb-6 text-gray-900">댓글 {mockComments.length}</h2>

                    {/* 댓글 입력 */}
                    <div className="mb-6">
                        <div className="flex gap-3">
                            {/* 현재 사용자 아바타 - 실제로는 현재 로그인한 사용자 정보 사용 */}
                            {renderAvatar('Me', null, 'small')}
                            <div className="flex-1">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="댓글을 입력하세요..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <div className="mt-2 flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={!comment.trim()}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            // TODO: 댓글 작성 로직
                                            console.log('댓글 작성:', comment);
                                            setComment('');
                                        }}
                                    >
                                        댓글 작성
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 리스트 */}
                    <div className="space-y-4">
                        {mockComments.length > 0 ? (
                            mockComments.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    {renderAvatar(c.author, c.avatar, 'small')}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">{c.author}</span>
                                            <span className="text-sm text-gray-500">{c.time}</span>
                                        </div>
                                        <p className="text-gray-700">{c.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">첫 댓글을 작성해보세요!</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DetailPage;
