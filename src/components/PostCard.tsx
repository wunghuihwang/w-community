import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle } from 'lucide-react';

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

export const PostCard = ({ post, onClick }: { post: Post; onClick: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0 border border-gray-300">
                    {post.author[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{post.author}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">{post.time}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>

                    <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>

                    {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                            <img src={post.image} alt="" className="w-full h-48 object-cover" />
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-gray-500">
                        <motion.div
                            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.likes}</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.comments}</span>
                        </motion.div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
