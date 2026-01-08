'use client';

import { useUnreadCount } from '@/query/common';
import { useAuthStore } from '@/store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, PenSquare, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NotificationDropdown } from '../NotificationDropdown';
import { MobileMenu } from '../header/MobileMenu';
import { SearchBar } from '../header/SearchBar';
import { UserMenu } from '../header/UserMenu';
import { WLogo } from '../header/WLogo';

export const Header = () => {
    const router = useRouter();
    const { user, loading } = useAuthStore();
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { data: notiLength } = useUnreadCount();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50"
        >
            <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <WLogo size="sm" />
                    <span className="text-xl font-bold text-gray-900 hidden sm:block">W Community</span>
                </div>

                <div className="hidden md:block flex-1 max-w-md mx-8">
                    <SearchBar />
                </div>

                {/* 데스크톱 네비게이션 */}
                <div className="hidden md:flex items-center gap-4">
                    {/* loading이 끝나고 user가 있을 때만 표시 */}
                    {!loading && user && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/posts/write')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                <PenSquare className="w-5 h-5" />
                                <span>글쓰기</span>
                            </motion.button>
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationOpen(!notificationOpen)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                                >
                                    <Bell className="w-6 h-6 text-gray-600" />
                                    {notiLength !== 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notificationOpen && (
                                        <NotificationDropdown
                                            isOpen={notificationOpen}
                                            onClose={() => setNotificationOpen(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                    {/* loading이 끝난 후에만 UserMenu 표시 */}
                    {!loading && <UserMenu />}

                    {/* 선택사항: 로딩 중일 때 스켈레톤 표시 */}
                    {loading && (
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Search className="w-6 h-6 text-gray-600" />
                    </button>
                    <MobileMenu />
                </div>
            </div>

            <AnimatePresence>{showMobileSearch && <SearchBar isMobile />}</AnimatePresence>
        </motion.header>
    );
};
