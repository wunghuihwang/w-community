'use client';

import { PostCard } from '@/components/PostCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const HomePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('latest');

    const latestPosts = [
        {
            id: 1,
            author: '개발자W',
            time: '2시간 전',
            title: 'Next.js 14로 풀스택 커뮤니티 만들기',
            content: 'App Router와 Server Components를 활용해서 최신 Next.js로 커뮤니티를 만들어봤어요.',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            likes: 42,
            comments: 12,
            views: 234,
        },
        {
            id: 2,
            author: '디자이너Kim',
            time: '5시간 전',
            title: '2024 웹 디자인 트렌드 총정리',
            content: '올해는 미니멀리즘과 심플한 UI가 대세입니다.',
            likes: 89,
            comments: 23,
            views: 456,
        },
    ];

    const trendingPosts = [
        {
            id: 4,
            author: 'CodeMaster',
            time: '1일 전',
            title: 'React 19 베타 버전 핵심 기능 정리',
            content: 'React 19에서 추가될 새로운 기능들을 미리 살펴봅시다. Server Components가 더 강력해졌어요!',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            likes: 523,
            comments: 87,
            views: 2340,
        },
        {
            id: 5,
            author: 'UXDesigner',
            time: '2일 전',
            title: '사용자 경험을 높이는 10가지 디자인 원칙',
            content: '실무에서 바로 적용할 수 있는 UX 디자인 팁들을 공유합니다.',
            likes: 412,
            comments: 56,
            views: 1890,
        },
        {
            id: 6,
            author: 'AIEnthusiast',
            time: '3일 전',
            title: 'ChatGPT API를 활용한 챗봇 만들기',
            content: 'OpenAI API를 사용해서 간단한 챗봇을 구현하는 방법을 알아봅시다.',
            likes: 367,
            comments: 45,
            views: 1567,
        },
    ];

    const displayPosts = activeTab === 'latest' ? latestPosts : trendingPosts;
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
                    {displayPosts.map((post, index) => (
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
