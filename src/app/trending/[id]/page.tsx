'use client';

import { PostDetailActions } from '@/components/PostDetailsActions';
import { checkIfLiked } from '@/lib/supabase/posts';
import {
    useCommentList,
    useDeleteComment,
    usePostComment,
    useSelectPost,
    useToggleLike,
    useUpdateComment,
} from '@/query/posts';
import { useAuthStore } from '@/store/useAuthStore';
import { useTrendingStore } from '@/store/useTrendingStore';
import { getRelativeTime } from '@/utills/common.utill';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Check, Heart, MessageCircle, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const DetailPage = () => {
    const { user } = useAuthStore();
    const { selectedPost, setSelectedPost, setCommentList, commentList } = useTrendingStore();

    const commentMutation = usePostComment();
    const deleteCommentMutation = useDeleteComment();
    const updateCommentMutation = useUpdateComment();

    const menuRef = useRef<HTMLDivElement>(null);
    const params = useParams();

    const [postId, setPostId] = useState<string>('');
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { data: postData, isSuccess } = useSelectPost(postId);
    const { data: commentData, isSuccess: isSuccesscommentData } = useCommentList(postId);

    const mockComments = [
        { id: 1, author: 'UserA', content: '정말 유익한 정보네요! 감사합니다.', time: '1시간 전' },
        { id: 2, author: 'UserB', content: '저도 이 방법으로 해봐야겠어요', time: '2시간 전' },
    ];
    if (!selectedPost) return <div>Loading...</div>;

    const renderAvatar = (username: string, avatarUrl: string | null, size: 'small' | 'medium' = 'medium') => {
        const sizeClasses = size === 'small' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

        if (avatarUrl) {
            return (
                <div className={`${sizeClasses} rounded-full overflow-hidden border border-gray-300 shrink-0`}>
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            );
        }

        const firstChar = username?.charAt(0).toUpperCase() || '?';
        return (
            <div
                className={`${sizeClasses} bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold border border-gray-300 shrink-0`}
            >
                {firstChar}
            </div>
        );
    };

    useEffect(() => {
        if (params.id) {
            setPostId(Array.isArray(params.id) ? params.id[0] : params.id);
        }
    }, [params.id]);

    useEffect(() => {
        if (postData && isSuccess) {
            console.log(postData);
            setSelectedPost(postData);
        }
    }, [postId, postData, isSuccess]);

    useEffect(() => {
        if (commentData && isSuccesscommentData) {
            setCommentList(commentData);
        }
    }, [postId, commentData, isSuccesscommentData]);

    // 메뉴 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCommentPush = () => {
        if (!comment.trim()) return;

        commentMutation.mutate(
            { content: comment.trim(), post_id: postId },
            {
                onSuccess: () => {
                    setComment('');
                },
                onError: (error) => {
                    console.error('댓글 작성 실패:', error);
                    alert(error instanceof Error ? error.message : '댓글 작성에 실패했습니다.');
                },
            },
        );
    };

    const handleEditStart = (commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
        setOpenMenuId(null);
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleEditSave = async (commentId: string) => {
        if (!editContent.trim()) return;
        if (!confirm('정말 이 댓글을 수정하시겠습니까?')) return;

        updateCommentMutation.mutate(
            { content: editContent, id: commentId },
            {
                onSuccess: () => {
                    alert('댓글이 수정되었습니다.');
                    setEditingCommentId(null);
                    setEditContent('');
                },
                onError: (error) => {
                    console.error('댓글 수정 실패:', error);
                    alert(error instanceof Error ? error.message : '댓글 수정에 실패했습니다.');
                },
            },
        );
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

        deleteCommentMutation.mutate(commentId, {
            onSuccess: () => {
                alert('댓글이 삭제되었습니다.');
            },
            onError: (error) => {
                console.error('댓글 삭제 실패:', error);
                alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
            },
        });
    };

    useEffect(() => {
        checkIfLiked(postId).then(setLiked);
    }, [postId]);

    // 좋아요 토글
    const handleToggleLike = async () => {
        try {
            const result = await useToggleLike(postId);
            console.log(result);
            setLiked(result.isLiked);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            alert('로그인이 필요합니다.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200 mb-6"
                >
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-3 mb-6">
                        {renderAvatar(selectedPost.profiles.username, selectedPost.profiles.avatar_url)}
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">{selectedPost.profiles.username}</div>
                            <div className="text-sm text-gray-500">{getRelativeTime(selectedPost.created_at)}</div>
                        </div>
                        <PostDetailActions postId={selectedPost.id} author={selectedPost.profiles.username} />
                    </div>

                    {/* 제목 */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">{selectedPost.title}</h1>

                    {/* 내용 */}
                    <div className="prose max-w-none mb-6 text-gray-700 leading-relaxed">{selectedPost.content}</div>

                    {/* 이미지 */}
                    {selectedPost.images && selectedPost.images.length > 0 && (
                        <div className="mb-6 space-y-4">
                            {selectedPost.images.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={image}
                                        alt={`${selectedPost.title} - 이미지 ${index + 1}`}
                                        className="w-full"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleToggleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                liked ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            <span>{(selectedPost.like_count ?? 0) + (liked ? 1 : 0)}</span>
                        </motion.button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            <MessageCircle className={`w-5 h-5`} />
                            <span>{selectedPost.comment_count ?? 0}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-auto">
                            <Bookmark className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* 댓글 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg p-8 border border-gray-200"
                >
                    <h2 className="text-xl font-bold mb-6 text-gray-900">댓글 {mockComments.length}</h2>

                    {/* 댓글 입력 */}
                    {user && (
                        <div className="mb-6">
                            <div className="flex gap-3">
                                {renderAvatar(user.email || 'User', null, 'small')}
                                <div className="flex-1">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="댓글을 입력하세요..."
                                        rows={3}
                                        maxLength={1000}
                                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{comment.length}/1000</span>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={!comment.trim() || commentMutation.isPending}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleCommentPush}
                                        >
                                            {commentMutation.isPending ? '작성 중...' : '댓글 작성'}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 댓글 리스트 */}
                    <div className="space-y-4">
                        {commentList && commentList.length > 0 ? (
                            commentList.map((c) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                                >
                                    {renderAvatar(c.profiles.username, c.profiles.avatar_url, 'small')}

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    {c.profiles.username}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {getRelativeTime(c.created_at)}
                                                </span>
                                            </div>

                                            {/* 수정/삭제 메뉴 (본인 댓글만) */}
                                            {user && user.id === c.user_id && (
                                                <div className="relative" ref={menuRef}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                                                        className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-600" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuId === c.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                transition={{ duration: 0.1 }}
                                                                className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                                                            >
                                                                <button
                                                                    onClick={() => handleEditStart(c.id, c.content)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                    수정
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(c.id)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    삭제
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>

                                        {/* 댓글 내용 or 수정 폼 */}
                                        {editingCommentId === c.id ? (
                                            <div className="mt-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={3}
                                                    maxLength={1000}
                                                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                    autoFocus
                                                />
                                                <div className="mt-2 flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">
                                                        {editContent.length}/1000
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleEditCancel}
                                                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            취소
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditSave(c.id)}
                                                            disabled={!editContent.trim()}
                                                            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            저장
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">첫 댓글을 작성해보세요!</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DetailPage;
