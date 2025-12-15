import useSupabaseBrowser from '@/lib/supabase/supabase-browser';
import { useAuthStore } from '@/store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const UserMenu = () => {
    const router = useRouter();
    const supabase = useSupabaseBrowser();
    const { user } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        router.push('/');
        setDropdownOpen(false);

        supabase.auth.signOut({ scope: 'local' });
    };

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/auth/login')}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-blue-500 transition-colors"
                >
                    로그인
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/auth/signup')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    회원가입
                </motion.button>
            </div>
        );
    }

    return (
        <div className="relative">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold border border-gray-300">
                    W
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
            </motion.div>

            <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                        <button
                            onClick={() => {
                                router.push('/profile');
                                setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">마이페이지</span>
                        </button>
                        <button
                            onClick={() => {
                                router.push('/profile/setting');
                                setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">설정</span>
                        </button>
                        <div className="border-t border-gray-200" />
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-700"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">로그아웃</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
