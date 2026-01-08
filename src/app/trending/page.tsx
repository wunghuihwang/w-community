'use client';
import { useTrendingPost } from '@/query/posts';
import { useTrendingStore } from '@/store/useTrendingStore';
import { motion } from 'framer-motion';
import { Eye, Flame, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TrendingPage = () => {
    const router = useRouter();
    const { post, setPost } = useTrendingStore();
    const { data: trendingPosts, isSuccess: isTrendingSuccess } = useTrendingPost();

    useEffect(() => {
        if (trendingPosts && isTrendingSuccess) {
            setPost(trendingPosts);
        }
    }, [trendingPosts, isTrendingSuccess]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-8 h-8 text-orange-500" />
                        <h1 className="text-3xl font-bold text-gray-900">인기 게시글</h1>
                    </div>
                    <p className="text-gray-600">지금 가장 핫한 이야기들을 만나보세요</p>
                </div>

                <div className="space-y-4">
                    {post.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg p-6 border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer"
                            onClick={() => {
                                router.push(`/trending/${post.id}`);
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-2xl font-black text-orange-500">#{index + 1}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.content}</p>
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
                                    <div className="flex items-center gap-6 text-gray-500">
                                        <span className="flex items-center gap-1 font-semibold text-red-500">
                                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />{' '}
                                            {post.like_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-5 h-5" /> {post.comment_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-5 h-5" /> {post.view_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingPage;
