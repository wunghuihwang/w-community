'use client';

import useSupabaseBrowser from '@/lib/supabase/supabase-browser';
import { useSelectPost, useUpdatePost } from '@/query/posts';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const EditPage = () => {
    const router = useRouter();
    const params = useParams();
    const supabase = useSupabaseBrowser();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [postId, setPostId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('general');
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { data: postData } = useSelectPost(postId);
    const updatePostMutation = useUpdatePost();

    // 카테고리 옵션
    const categories = [
        { value: 'all', label: '전체' },
        { value: 'development', label: '개발' },
        { value: 'design', label: '디자인' },
        { value: 'business', label: '비즈니스' },
    ];

    // URL에서 postId 가져오기
    useEffect(() => {
        if (params.id) {
            setPostId(Array.isArray(params.id) ? params.id[0] : params.id);
        }
    }, [params.id]);

    // 게시글 데이터 로드
    useEffect(() => {
        if (postData) {
            // 권한 체크
            if (postData.user_id !== user?.id) {
                alert('수정 권한이 없습니다.');
                router.back();
                return;
            }

            setTitle(postData.title);
            setContent(postData.content);
            setCategory(postData.category || 'general');
            setExistingImages(postData.images || []);
            setIsLoading(false);
        }
    }, [postData, user, router]);

    // 새 이미지 파일 선택 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        // 최대 5개 이미지 제한 (기존 + 새로운)
        if (existingImages.length + newImages.length + fileArray.length > 5) {
            alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
            return;
        }

        // 파일 크기 체크 (각 파일 5MB 제한)
        const oversizedFiles = fileArray.filter((file) => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('각 이미지는 5MB 이하여야 합니다.');
            return;
        }

        // 이미지 파일만 허용
        const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));
        if (imageFiles.length !== fileArray.length) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        // 미리보기 생성
        const newPreviews: string[] = [];
        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    newPreviews.push(e.target.result as string);
                    if (newPreviews.length === imageFiles.length) {
                        setNewImagePreviews((prev) => [...prev, ...newPreviews]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });

        setNewImages((prev) => [...prev, ...imageFiles]);
    };

    // 기존 이미지 제거
    const handleRemoveExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 새 이미지 제거
    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Supabase Storage에 이미지 업로드
    const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage.from('post-images').upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

            if (error) {
                console.error('이미지 업로드 실패:', error);
                throw error;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('post-images').getPublicUrl(filePath);

            uploadedUrls.push(publicUrl);
        }

        return uploadedUrls;
    };

    // 게시글 수정
    const handleSubmit = async () => {
        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        setIsUploading(true);

        try {
            // 새 이미지 업로드
            let newImageUrls: string[] = [];
            if (newImages.length > 0) {
                newImageUrls = await uploadImagesToStorage(newImages);
            }

            // 기존 이미지 + 새 이미지 합치기
            const finalImages = [...existingImages, ...newImageUrls];

            const params = {
                id: postId,
                title: title.trim(),
                content: content.trim(),
                category: category,
                images: finalImages.length > 0 ? finalImages : [],
            };

            console.log(params);
            updatePostMutation.mutate(
                { post: params },
                {
                    onSuccess: () => {
                        alert('게시글이 수정되었습니다!');
                        router.push(`/posts/${postId}`);
                    },
                    onError: (error) => {
                        console.error('게시글 수정 실패:', error);
                        alert('게시글 수정 중 오류가 발생했습니다.');
                    },
                },
            );
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
                <div className="text-gray-500">게시글을 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-8 border border-gray-200"
                >
                    {/* 헤더 */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">게시글 수정</h1>
                    </div>

                    {/* 카테고리 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            카테고리 <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 제목 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            disabled={isUploading}
                            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* 내용 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            rows={12}
                            disabled={isUploading}
                            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* 이미지 관리 */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            이미지 (최대 5개, 각 5MB 이하)
                        </label>

                        {/* 기존 이미지 */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">기존 이미지</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {existingImages.map((image, index) => (
                                        <div key={`existing-${index}`} className="relative group">
                                            <img
                                                src={image}
                                                alt={`existing-${index}`}
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() => handleRemoveExistingImage(index)}
                                                disabled={isUploading}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 새 이미지 미리보기 */}
                        {newImagePreviews.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">새 이미지</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`preview-${index}`}
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() => handleRemoveNewImage(index)}
                                                disabled={isUploading}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 업로드 버튼 */}
                        {existingImages.length + newImages.length < 5 && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-all flex flex-col items-center gap-2 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="font-medium">업로드 중...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8" />
                                            <span className="font-medium">
                                                이미지 추가 ({existingImages.length + newImages.length}/5)
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                JPG, PNG, GIF 등 (각 5MB 이하)
                                            </span>
                                        </>
                                    )}
                                </motion.button>
                            </>
                        )}
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleSubmit}
                            disabled={isUploading || !title.trim() || !content.trim()}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? '수정 중...' : '수정 완료'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.back()}
                            disabled={isUploading}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            취소
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EditPage;
