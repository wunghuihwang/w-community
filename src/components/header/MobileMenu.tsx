import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Home, Menu, PenSquare, TrendingUp, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const MobileMenu = ({
    isLoggedIn,
    setIsLoggedIn,
}: {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: Home, label: '홈', page: 'home' },
        { icon: TrendingUp, label: '인기글', page: 'trending' },
        ...(isLoggedIn
            ? [
                  { icon: PenSquare, label: '글쓰기', page: 'posts/write' },
                  { icon: Bell, label: '알림', page: 'notifications' },
                  { icon: User, label: '프로필', page: 'profile' },
              ]
            : []),
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween' }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl z-50 md:hidden"
                        >
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">메뉴</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-6 h-6 text-gray-700" />
                                </button>
                            </div>

                            <div className="p-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.page}
                                            onClick={() => {
                                                router.push(`/${item.page}`);
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
                                        >
                                            <Icon className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                        </button>
                                    );
                                })}

                                {!isLoggedIn && (
                                    <>
                                        <div className="border-t border-gray-200 my-2" />
                                        <button
                                            onClick={() => {
                                                router.push('/auth/login');
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            로그인
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
