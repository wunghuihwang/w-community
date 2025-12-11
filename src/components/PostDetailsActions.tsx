import { Post } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Flag, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

export const PostDetailActions = (author: Pick<Post, 'author'>) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative ml-auto">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
                    >
                        {author ? (
                            <>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <Edit className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-700">수정하기</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="font-medium">삭제하기</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    alert('신고되었습니다');
                                    setDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                                <Flag className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-700">신고하기</span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
