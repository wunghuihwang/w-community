'use client';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, User } from 'lucide-react';
import { useState } from 'react';

const AllNotificationsPage = () => {
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
        {
            id: 5,
            type: 'comment',
            user: 'UserE',
            content: '댓글을 남겼습니다',
            post: 'Tailwind CSS 가이드',
            time: '2일 전',
            read: true,
        },
        {
            id: 6,
            type: 'like',
            user: 'FanF',
            content: '회원님의 게시글을 좋아합니다',
            post: 'Supabase 활용법',
            time: '3일 전',
            read: true,
        },
        {
            id: 7,
            type: 'follow',
            user: 'UserG',
            content: '회원님을 팔로우하기 시작했습니다',
            time: '4일 전',
            read: true,
        },
        {
            id: 8,
            type: 'comment',
            user: 'DevH',
            content: '댓글을 남겼습니다',
            post: 'React Query 튜토리얼',
            time: '5일 전',
            read: true,
        },
    ]);

    const [filterTab, setFilterTab] = useState('all');

    const markAsRead = (id: number) => {
        setNotifications(notifications.map((n: any) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const filteredNotifications =
        filterTab === 'all'
            ? notifications
            : filterTab === 'unread'
              ? notifications.filter((n) => !n.read)
              : notifications.filter((n) => n.type === filterTab);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">모든 알림</h1>
                    <button onClick={markAllAsRead} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                        모두 읽음 표시
                    </button>
                </div>

                {/* 필터 탭 */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    {['all', 'unread', 'like', 'comment', 'follow'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`px-4 py-3 font-semibold transition-colors relative ${
                                filterTab === tab ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'all' && '전체'}
                            {tab === 'unread' && '읽지 않음'}
                            {tab === 'like' && '좋아요'}
                            {tab === 'comment' && '댓글'}
                            {tab === 'follow' && '팔로우'}
                            {filterTab === tab && (
                                <motion.div
                                    layoutId="notifTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* 알림 리스트 */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">알림이 없습니다</p>
                            <p className="text-sm">새로운 활동이 있으면 알려드릴게요!</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                    !notif.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markAsRead(notif.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                        {notif.type === 'like' && (
                                            <Heart className="w-6 h-6 text-red-500 fill-current" />
                                        )}
                                        {notif.type === 'comment' && (
                                            <MessageCircle className="w-6 h-6 text-blue-500" />
                                        )}
                                        {notif.type === 'follow' && <User className="w-6 h-6 text-green-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900">
                                            <span className="font-semibold">{notif.user}</span> {notif.content}
                                            {notif.post && <span className="text-blue-500"> "{notif.post}"</span>}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllNotificationsPage;
