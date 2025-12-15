import { Post } from '@/types';
import { getRelativeTime } from '@/utills/common.utill';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle } from 'lucide-react';

export const PostCard = ({ post, onClick }: { post: Post; onClick: () => void }) => {
    // 디버깅용

    // 아바타 렌더링 함수
    const renderAvatar = () => {
        if (post.profiles.avatar_url) {
            return (
                <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.username}
                    className="w-full h-full object-cover"
                />
            );
        }

        // 아바타가 없으면 첫 글자만 표시
        const firstChar = post.profiles.username?.charAt(0).toUpperCase() || '?';
        return <span className="text-gray-700 font-semibold text-base">{firstChar}</span>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                {/* 프로필 아바타 */}
                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                    {renderAvatar()}
                </div>

                <div className="flex-1 min-w-0">
                    {/* 작성자 / 시간 */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{post.profiles.username || '알 수 없음'}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">{getRelativeTime(post.created_at)}</span>
                    </div>

                    {/* 카테고리 (있는 경우) */}
                    {post.category && post.category !== 'all' && (
                        <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                                {post.category}
                            </span>
                        </div>
                    )}

                    {/* 제목 */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>

                    {/* 내용 */}
                    <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>

                    {/* 이미지 (첫 번째 이미지) */}
                    {post.images && post.images.length > 0 && post.images[0] && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={post.images[0]}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    // 이미지 로드 실패시 숨김
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-6 text-gray-500">
                        <motion.div
                            className="flex items-center gap-2 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.like_count ?? 0}</span>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.comment_count ?? 0}</span>
                        </motion.div>

                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.view_count ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
