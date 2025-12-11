'use client';
import { WLogo } from '@/components/header/WLogo';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignupPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignup = () => {
        alert('회원가입이 완료되었습니다!');
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-8 border border-gray-200 w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <WLogo size="lg" />
                    <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900">회원가입</h1>
                    <p className="text-gray-600">새로운 계정을 만들어보세요</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">사용자명</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleSignup}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors mt-6"
                    >
                        회원가입
                    </motion.button>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        이미 계정이 있으신가요?{' '}
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            로그인
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
