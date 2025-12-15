'use client';
import { Pagination } from '@/components/Pagination';
import { usePostList } from '@/query/posts';
import { usePostsStore } from '@/store/usePostsStore';
import { getRelativeTime } from '@/utills/common.utill';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const PostsPage = () => {
    const router = useRouter();
    const [totalCount, setTotalCount] = useState(-1);
    const [filterTab, setFilterTab] = useState('all');

    const { filterParams, setFilterParams, setPost, post } = usePostsStore();
    const [activeTab, setActiveTab] = useState('latest');
    const postListmutate = usePostList();

    const handlePageChange = (newPage: number) => {
        setFilterParams({
            ...filterParams,
            page: newPage,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        postListmutate.mutate(
            {
                page: filterParams.page,
                limit: filterParams.limit,
                category: filterParams.category,
            },
            {
                onSuccess: (val) => {
                    setPost(val.posts);
                    setTotalCount(val.totalCount);
                },
            },
        );
    }, [activeTab, setPost, filterParams.page]);

    const categories = [
        { id: 'all', label: '전체' },
        { id: 'development', label: '개발' },
        { id: 'design', label: '디자인' },
        { id: 'business', label: '비즈니스' },
    ];

    const filteredPosts = filterTab === 'all' ? post : post.filter((item) => item.category === filterTab);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">모든 게시글</h1>
                    <p className="text-gray-600">커뮤니티의 모든 게시글을 한눈에 살펴보세요</p>
                </div>

                {/* 카테고리 필터 */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterTab(cat.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                                filterTab === cat.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* 게시글 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
                            onClick={() => router.push(`/posts/${post.id}`)}
                        >
                            <div className="flex items-start gap-4">
                                {/* 프로필 아바타 */}
                                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                                    {post.profiles.avatar_url ? (
                                        <img
                                            src={post.profiles.avatar_url}
                                            alt={post.profiles.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-700 font-semibold text-base">
                                            {post.profiles.username?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* 작성자 / 시간 */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">
                                            {post.profiles.username || '알 수 없음'}
                                        </span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-500 text-sm">
                                            {getRelativeTime(post.created_at)}
                                        </span>
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
                    ))}
                </div>

                {/* 페이지네이션 */}
                {/* {totalCount > 0 && ( */}
                {/* )} */}
            </div>
            <Pagination
                currentPage={filterParams.page}
                totalCount={totalCount}
                limit={filterParams.limit}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PostsPage;
