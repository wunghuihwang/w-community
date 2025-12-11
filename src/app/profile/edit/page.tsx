'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ProfileEditPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('개발자W');
    const [bio, setBio] = useState('안녕하세요! 프론트엔드 개발자입니다.');
    const [email, setEmail] = useState('developer@example.com');

    const handleSave = () => {
        alert('프로필이 수정되었습니다!');
        router.push('/profile');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200"
                >
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">프로필 수정</h1>

                    {/* 프로필 이미지 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">프로필 이미지</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold border-2 border-gray-300">
                                W
                            </div>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                이미지 변경
                            </button>
                        </div>
                    </div>

                    {/* 사용자명 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">사용자명</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 소개 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">소개</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* 이메일 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleSave}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                        >
                            저장하기
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push('/profile')}
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

export default ProfileEditPage;
