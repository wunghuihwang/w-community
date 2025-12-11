'use client';

import { PostDetailActions } from '@/components/PostDetailsActions';
import { useTrendingStore } from '@/store/useTrendingStore';
import { motion } from 'framer-motion';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

type Post = {
    id: number;
    author: string;
    time: string;
    title: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    views: number;
};
const DetailPage = () => {
    const { selectedPost } = useTrendingStore();
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const mockComments = [
        { id: 1, author: 'UserA', content: '정말 유익한 정보네요! 감사합니다.', time: '1시간 전' },
        { id: 2, author: 'UserB', content: '저도 이 방법으로 해봐야겠어요', time: '2시간 전' },
    ];
    if (!selectedPost) return <div>Loading...</div>;

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
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold border border-gray-300">
                            {selectedPost.author.toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{selectedPost.author}</div>
                            <div className="text-sm text-gray-500">{selectedPost.time}</div>
                        </div>
                        <PostDetailActions author={selectedPost.author} />
                    </div>

                    {/* 제목 */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">{selectedPost.title}</h1>

                    {/* 내용 */}
                    <div className="prose max-w-none mb-6 text-gray-700 leading-relaxed">{selectedPost.content}</div>

                    {/* 이미지 */}
                    {selectedPost.image && (
                        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                            <img src={selectedPost.image} alt="" className="w-full" />
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                liked ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            <span>{selectedPost.likes + (liked ? 1 : 0)}</span>
                        </motion.button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            <MessageCircle className={`w-5 h-5`} />
                            <span>{selectedPost.comments}</span>
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
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0 border border-gray-300">
                                W
                            </div>
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
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        댓글 작성
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 리스트 */}
                    <div className="space-y-4">
                        {mockComments.map((c) => (
                            <div key={c.id} className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0 border border-gray-300">
                                    {c.author[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">{c.author}</span>
                                        <span className="text-sm text-gray-500">{c.time}</span>
                                    </div>
                                    <p className="text-gray-700">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DetailPage;
