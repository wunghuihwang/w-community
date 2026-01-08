'use client';

import { PostCard } from '@/components/PostCard';
import { usePostList, useTrendingPost } from '@/query/posts';
import { usePostsStore } from '@/store/usePostsStore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const HomePage = () => {
    const router = useRouter();
    const { filterParams, setFilterParams, setPost, post } = usePostsStore();
    const [activeTab, setActiveTab] = useState('latest');

    const postListmutate = usePostList();
    const { data: trendingPosts, isSuccess: isTrendingSuccess } = useTrendingPost();

    useEffect(() => {
        postListmutate.mutate(
            {
                page: filterParams.page,
                limit: filterParams.limit,
                category: filterParams.category,
            },
            {
                onSuccess: (val) => {
                    if (activeTab === 'latest' && val) {
                        console.log(val);
                        // console.log('Fetched posts:', postList);
                        setPost(val.posts);
                    }

                    if (activeTab === 'trending' && trendingPosts && isTrendingSuccess) {
                        setPost(trendingPosts);
                    }
                },
            },
        );
    }, [activeTab, trendingPosts, isTrendingSuccess, setPost]);

    const displayRoutets = activeTab === 'latest' ? 'posts' : 'trending';

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* 탭 */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    {['latest', 'trending'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-semibold transition-colors relative ${
                                activeTab === tab ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'latest' ? '최신' : '인기'}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* 게시글 목록 */}

                <div className="space-y-4">
                    {post &&
                        post.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PostCard
                                    post={post}
                                    onClick={() => {
                                        router.push(`/${displayRoutets}/${post.id}`);
                                    }}
                                />
                            </motion.div>
                        ))}
                </div>

                {/* 더보기 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-center">
                    <button
                        className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-all font-medium text-gray-700"
                        onClick={() => router.push(`/${displayRoutets}`)}
                    >
                        더 보기
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
