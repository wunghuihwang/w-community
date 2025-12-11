'use client';
import { useTrendingStore } from '@/store/useTrendingStore';
import { motion } from 'framer-motion';
import { Eye, Flame, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TrendingPage = () => {
    const router = useRouter();
    const { setSelectedPost } = useTrendingStore();
    const trendingPosts = [
        {
            id: 1,
            author: 'TechGuru',
            time: '1일 전',
            title: '🔥 이번 주 가장 핫한 개발 트렌드',
            content: 'AI, Web3, 클라우드 네이티브... 2024년 개발자라면 꼭 알아야 할 키워드들!',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            likes: 1248,
            comments: 156,
            views: 5432,
            trending: true,
        },
        {
            id: 2,
            author: 'StartupCEO',
            time: '2일 전',
            title: '스타트업 개발자가 알아야 할 5가지',
            content: '빠르게 성장하는 스타트업 환경에서 살아남는 법',
            likes: 892,
            comments: 98,
            views: 3210,
            trending: true,
        },
    ];

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
                    {trendingPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg p-6 border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer"
                            onClick={() => {
                                setSelectedPost(post);
                                router.push(`/trending/${post.id}`);
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-2xl font-black text-orange-500">#{index + 1}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.content}</p>
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt=""
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <div className="flex items-center gap-6 text-gray-500">
                                        <span className="flex items-center gap-1 font-semibold text-red-500">
                                            <Heart className="w-5 h-5" /> {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-5 h-5" /> {post.comments}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-5 h-5" /> {post.views}
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
