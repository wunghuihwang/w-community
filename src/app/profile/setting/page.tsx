'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SettingsPage = () => {
    const router = useRouter();
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">설정</h1>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* 알림 설정 */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">이메일 알림</h3>
                                    <p className="text-sm text-gray-500">새로운 댓글이나 좋아요를 이메일로 받습니다</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotif(!emailNotif)}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        emailNotif ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow"
                                        animate={{ x: emailNotif ? 26 : 2 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">푸시 알림</h3>
                                    <p className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</p>
                                </div>
                                <button
                                    onClick={() => setPushNotif(!pushNotif)}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        pushNotif ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow"
                                        animate={{ x: pushNotif ? 26 : 2 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 계정 관리 */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">계정 관리</h2>
                        <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            계정 삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
