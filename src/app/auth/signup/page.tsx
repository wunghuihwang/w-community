// app/(auth)/signup/page.tsx
'use client';

import { useSingUpRequest } from '@/query/auth';
import { validateEmail, validatePassword, validateUsername } from '@/utills/common.utill';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
    const router = useRouter();

    const signupMutaion = useSingUpRequest();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [passwordStrength, setPasswordStrength] = useState('');
    const [loading, setLoading] = useState(false);

    // 실시간 이메일 검사
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setFormData({ ...formData, email });

        const validation = validateEmail(email);
        setErrors({ ...errors, email: validation.error || '' });
    };

    // 실시간 사용자명 검사
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setFormData({ ...formData, username });

        const validation = validateUsername(username);
        setErrors({ ...errors, username: validation.error || '' });
    };

    // 실시간 비밀번호 검사
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setFormData({ ...formData, password });

        const validation = validatePassword(password);
        setErrors({ ...errors, password: validation.error || '' });
        setPasswordStrength(validation.strength || '');
    };

    // 비밀번호 확인 검사
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassword = e.target.value;
        setFormData({ ...formData, confirmPassword });

        if (confirmPassword && confirmPassword !== formData.password) {
            setErrors({ ...errors, confirmPassword: '비밀번호가 일치하지 않습니다.' });
        } else {
            setErrors({ ...errors, confirmPassword: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const emailValidation = validateEmail(formData.email);
        const usernameValidation = validateUsername(formData.username);
        const passwordValidation = validatePassword(formData.password);

        if (!emailValidation.isValid || !usernameValidation.isValid || !passwordValidation.isValid) {
            setErrors({
                email: emailValidation.error || '',
                username: usernameValidation.error || '',
                password: passwordValidation.error || '',
                confirmPassword: '',
            });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ ...errors, confirmPassword: '비밀번호가 일치하지 않습니다.' });
            setLoading(false);
            return;
        }

        // 회원가입
        signupMutaion.mutate(
            {
                email: formData.email,
                password: formData.password,
                username: formData.username,
            },
            {
                onSuccess: () => {
                    alert('회원가입 성공! 이메일을 확인해주세요.');
                    router.push('/');
                    setLoading(false);
                },
                onError: (err) => {
                    alert(err.message || '회원가입에 실패했습니다.');
                },
            },
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl text-gray-900 font-bold text-center mb-6">회원가입</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 사용자명 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">사용자명</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleUsernameChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 border-gray-300 ${
                                errors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                            placeholder="홍길동"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">이메일</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 border-gray-300 ${
                                errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                            placeholder="example@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">비밀번호</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 border-gray-300 ${
                                errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                            placeholder="6자 이상"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        {passwordStrength && !errors.password && (
                            <p
                                className={`text-sm mt-1 ${
                                    passwordStrength === '강함'
                                        ? 'text-green-500'
                                        : passwordStrength === '보통'
                                          ? 'text-yellow-500'
                                          : 'text-red-500'
                                }`}
                            >
                                비밀번호 강도: {passwordStrength}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">비밀번호 확인</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 border-gray-300 ${
                                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                            placeholder="비밀번호 재입력"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                        {!errors.confirmPassword &&
                            formData.confirmPassword &&
                            formData.password === formData.confirmPassword && (
                                <p className="text-green-500 text-sm mt-1">✓ 비밀번호가 일치합니다</p>
                            )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || Object.values(errors).some((err) => err !== '')}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '처리중...' : '회원가입'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    이미 계정이 있으신가요?{' '}
                    <a href="/auth/signin" className="text-blue-500 hover:underline">
                        로그인
                    </a>
                </p>
            </div>
        </div>
    );
}
