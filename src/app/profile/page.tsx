'use client';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ProfilePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('posts');

    const myPosts = [
        { id: 1, title: 'Next.js 14로 풀스택 커뮤니티 만들기', likes: 42, comments: 12, time: '2시간 전' },
        { id: 2, title: 'TypeScript 5.0 새로운 기능', likes: 89, comments: 23, time: '1일 전' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* 프로필 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200 mb-6"
                >
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-3xl font-bold border-2 border-gray-300">
                            W
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">개발자W</h1>
                            <p className="text-gray-600 mb-4">안녕하세요! 프론트엔드 개발자입니다.</p>
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-900">42</span>
                                    <span className="text-gray-600 ml-1">게시글</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">128</span>
                                    <span className="text-gray-600 ml-1">댓글</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">1.2K</span>
                                    <span className="text-gray-600 ml-1">좋아요</span>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/profile/edit')}
                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            프로필 수정
                        </motion.button>
                    </div>
                </motion.div>

                {/* 탭 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                    <div className="flex border-b border-gray-200">
                        {['posts', 'comments', 'likes'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-4 py-3 font-semibold transition-colors relative ${
                                    activeTab === tab ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'posts' && '내 게시글'}
                                {tab === 'comments' && '댓글'}
                                {tab === 'likes' && '좋아요'}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="profileTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 게시글 리스트 */}
                    <div className="p-4">
                        {myPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" />
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {post.comments}
                                    </span>
                                    <span>{post.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
