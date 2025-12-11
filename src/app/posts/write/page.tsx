import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const WritePage = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        alert('게시글이 작성되었습니다!');
        router.push('/home');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200"
                >
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">새 게시글 작성</h1>

                    {/* 제목 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* 내용 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            rows={12}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                        />
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">이미지</label>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-all flex flex-col items-center gap-2 text-gray-500 hover:text-blue-500"
                        >
                            <Upload className="w-8 h-8" />
                            <span className="font-medium">이미지 업로드</span>
                        </motion.button>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleSubmit}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                        >
                            게시하기
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push('/home')}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            취소
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WritePage;
