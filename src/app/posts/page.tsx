'use client';
import { usePostsStore } from '@/store/usePostsStore';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const PostsPage = () => {
    const router = useRouter();
    const { setSelectedPost } = usePostsStore();
    const [filterTab, setFilterTab] = useState('all');

    const allPosts = [
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
            category: 'development',
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
            category: 'design',
        },
        {
            id: 3,
            author: 'TechLover',
            time: '1일 전',
            title: 'TypeScript 5.0 새로운 기능 정리',
            content: 'TypeScript 5.0에서 추가된 decorator 기능과 성능 개선 사항들을 정리해봤습니다.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            likes: 156,
            comments: 34,
            views: 678,
            category: 'development',
        },
        {
            id: 4,
            author: 'ProductManager',
            time: '1일 전',
            title: '성공적인 제품 출시를 위한 전략',
            content: '프로덕트 매니저로서 배운 제품 출시 노하우를 공유합니다.',
            likes: 67,
            comments: 18,
            views: 345,
            category: 'business',
        },
    ];

    const categories = [
        { id: 'all', label: '전체' },
        { id: 'development', label: '개발' },
        { id: 'design', label: '디자인' },
        { id: 'business', label: '비즈니스' },
    ];

    const filteredPosts = filterTab === 'all' ? allPosts : allPosts.filter((post) => post.category === filterTab);

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
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
                            onClick={() => {
                                setSelectedPost(post);
                                router.push(`/posts/${post.id}`);
                            }}
                        >
                            {/* 이미지 */}
                            {post.image && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                    <img src={post.image} alt="" className="w-full h-40 object-cover" />
                                </div>
                            )}

                            {/* 작성자 */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm border border-gray-300">
                                    {post.author[0].toUpperCase()}
                                </div>
                                <div>
                                    <span className="font-semibold text-sm text-gray-900">{post.author}</span>
                                    <span className="text-gray-400 text-sm"> · {post.time}</span>
                                </div>
                            </div>

                            {/* 제목 */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>

                            {/* 내용 */}
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.content}</p>

                            {/* 통계 */}
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    {post.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {post.views}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <div className="mt-8 flex justify-center gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">1</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                        2
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                        3
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostsPage;
