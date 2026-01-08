import { useMarkAllAsRead, useMarkNotificationAsRead, useNotiList, useUnreadCount } from '@/query/common';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const NotificationDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const { user } = useAuthStore();
    const { data } = useNotiList(userId);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'like',
            user: '개발자A',
            content: '회원님의 게시글을 좋아합니다',
            post: 'Next.js 튜토리얼',
            time: '5분 전',
            read: false,
        },
        {
            id: 2,
            type: 'comment',
            user: '디자이너B',
            content: '댓글을 남겼습니다',
            post: 'React 최적화',
            time: '1시간 전',
            read: false,
        },
        {
            id: 3,
            type: 'follow',
            user: 'UserC',
            content: '회원님을 팔로우하기 시작했습니다',
            time: '2시간 전',
            read: true,
        },
        {
            id: 4,
            type: 'like',
            user: 'DevD',
            content: '회원님의 댓글을 좋아합니다',
            post: 'TypeScript 팁',
            time: '1일 전',
            read: true,
        },
    ]);

    const { data: unreadCount } = useUnreadCount();
    const markAsRead = useMarkNotificationAsRead();
    const markAllAsRead = useMarkAllAsRead();

    // 개별 알림 클릭 시
    const handleNotificationClick = (notificationId: string) => {
        markAsRead.mutate(notificationId);
    };

    // 모두 읽기 버튼 클릭 시
    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    useEffect(() => {
        if (!user) return;

        setUserId(user.id);
    }, [user]);

    if (!isOpen) return null;

    return (
        <>
            {/* 백드롭 */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* 드롭다운 */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
                {/* 헤더 */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h3 className="font-bold text-gray-900">알림</h3>
                        {unreadCount && unreadCount > 0 && (
                            <p className="text-sm text-blue-500">{unreadCount}개의 새 알림</p>
                        )}
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                        모두 읽음
                    </button>
                </div>

                {/* 알림 리스트 */}
                <div className="max-h-96 overflow-y-auto">
                    {data?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>새로운 알림이 없습니다</p>
                        </div>
                    ) : (
                        data &&
                        data.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                    !notif.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                    handleNotificationClick(notif.id);
                                    router.push(`/posts/${notif.post_id}`);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                        {notif.type === 'like' && (
                                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                                        )}
                                        {notif.type === 'comment' && (
                                            <MessageCircle className="w-5 h-5 text-blue-500" />
                                        )}
                                        {notif.type === 'follow' && <User className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-semibold">{notif.user}</span> {notif.content}
                                            {notif.post && <span className="text-blue-500"> "{notif.post}"</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* 푸터 */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                        className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
                        onClick={() => router.push('/notifications')}
                    >
                        모든 알림 보기
                    </button>
                </div>
            </motion.div>
        </>
    );
};
