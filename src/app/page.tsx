'use client';

import { PostCard } from '@/components/PostCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const HomePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('latest');

    const mockPosts = [
        {
            id: 1,
            author: '개발자W',
            time: '2시간 전',
            title: 'Next.js 14로 풀스택 커뮤니티 만들기',
            content:
                'App Router와 Server Components를 활용해서 최신 Next.js로 커뮤니티를 만들어봤어요. Supabase와의 조합이 정말 환상적이네요!',
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
            content:
                '올해는 미니멀리즘과 심플한 UI가 대세입니다. 과도한 장식보다는 깔끔하고 직관적인 디자인이 주목받고 있어요.',
            likes: 89,
            comments: 23,
            views: 456,
        },
        {
            id: 3,
            author: 'TechLover',
            time: '1일 전',
            title: 'TypeScript 5.0 새로운 기능 정리',
            content:
                'TypeScript 5.0에서 추가된 decorator 기능과 성능 개선 사항들을 정리해봤습니다. 체감 속도가 확실히 빨라졌네요!',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            likes: 156,
            comments: 34,
            views: 678,
        },
    ];

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
                    {mockPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PostCard
                                post={post}
                                onClick={() => {
                                    // setSelectedPost(post);
                                    router.push(`/posts/${post.id}`);
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* 더보기 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-center">
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-all font-medium text-gray-700">
                        더 보기
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
