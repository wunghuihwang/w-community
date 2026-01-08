export const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';

    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return postDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// lib/utils/validation.ts

/**
 * 📧 이메일 유효성 검사
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    // 빈 값 체크
    if (!email || email.trim() === '') {
        return { isValid: false, error: '이메일을 입력해주세요.' };
    }

    // 기본 이메일 형식 체크 (정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' };
    }

    // 더 엄격한 이메일 검사 (RFC 5322 기반)
    const strictEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!strictEmailRegex.test(email)) {
        return { isValid: false, error: '유효하지 않은 이메일 주소입니다.' };
    }

    // 이메일 길이 체크 (최대 254자)
    if (email.length > 254) {
        return { isValid: false, error: '이메일이 너무 깁니다.' };
    }

    // 로컬 파트 (@앞) 길이 체크 (최대 64자)
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) {
        return { isValid: false, error: '이메일 주소가 너무 깁니다.' };
    }

    // 도메인 체크
    if (domain.length > 255) {
        return { isValid: false, error: '도메인이 너무 깁니다.' };
    }

    // 연속된 점(.) 체크
    if (email.includes('..')) {
        return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' };
    }

    // 시작/끝 점(.) 체크
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return { isValid: false, error: '이메일은 점(.)으로 시작하거나 끝날 수 없습니다.' };
    }

    // 금지된 문자 체크
    const forbiddenChars = /[<>()[\]\\,;:\s]/;
    if (forbiddenChars.test(localPart)) {
        return { isValid: false, error: '이메일에 사용할 수 없는 문자가 포함되어 있습니다.' };
    }

    // 유명 도메인 오타 체크 (선택)
    const commonDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'outlook.com', 'yahoo.com'];
    const domainLower = domain.toLowerCase();

    const typoSuggestions: Record<string, string> = {
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'gnail.com': 'gmail.com',
        'naber.com': 'naver.com',
        'navr.com': 'naver.com',
        'daum.com': 'daum.net',
    };

    if (typoSuggestions[domainLower]) {
        return {
            isValid: false,
            error: `혹시 ${typoSuggestions[domainLower]}을(를) 입력하려고 하셨나요?`,
        };
    }

    return { isValid: true };
};

/**
 * 👤 사용자명 유효성 검사
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    if (!username || username.trim() === '') {
        return { isValid: false, error: '사용자명을 입력해주세요.' };
    }

    if (username.length < 2) {
        return { isValid: false, error: '사용자명은 2자 이상이어야 합니다.' };
    }

    if (username.length > 30) {
        return { isValid: false, error: '사용자명은 30자 이하여야 합니다.' };
    }

    // 한글, 영문, 숫자, 언더스코어만 허용
    const usernameRegex = /^[가-힣a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, error: '사용자명은 한글, 영문, 숫자, _만 사용할 수 있습니다.' };
    }

    // 금지어 체크
    const forbiddenWords = ['admin', 'root', 'system', 'test', 'null', 'undefined'];
    if (forbiddenWords.some((word) => username.toLowerCase().includes(word))) {
        return { isValid: false, error: '사용할 수 없는 사용자명입니다.' };
    }

    return { isValid: true };
};

/**
 * 🔒 비밀번호 유효성 검사
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string; strength?: string } => {
    if (!password || password.trim() === '') {
        return { isValid: false, error: '비밀번호를 입력해주세요.' };
    }

    if (password.length < 6) {
        return { isValid: false, error: '비밀번호는 6자 이상이어야 합니다.' };
    }

    if (password.length > 128) {
        return { isValid: false, error: '비밀번호가 너무 깁니다.' };
    }

    // 비밀번호 강도 체크
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++; // 소문자
    if (/[A-Z]/.test(password)) strength++; // 대문자
    if (/[0-9]/.test(password)) strength++; // 숫자
    if (/[^a-zA-Z0-9]/.test(password)) strength++; // 특수문자

    const strengthLevel = strength < 3 ? '약함' : strength < 5 ? '보통' : '강함';

    // 최소 강도 체크
    if (strength < 2) {
        return {
            isValid: false,
            error: '비밀번호가 너무 약합니다. 영문, 숫자를 포함해주세요.',
            strength: strengthLevel,
        };
    }

    // 연속된 문자 체크
    if (/(.)\1{2,}/.test(password)) {
        return { isValid: false, error: '같은 문자를 3번 이상 연속으로 사용할 수 없습니다.' };
    }

    // 흔한 비밀번호 체크
    const commonPasswords = ['123456', 'password', 'qwerty', '12345678', 'abc123'];
    if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
        return { isValid: false, error: '너무 흔한 비밀번호입니다.' };
    }

    return { isValid: true, strength: strengthLevel };
};

/**
 * 📋 전체 회원가입 폼 유효성 검사
 */
export const validateSignUpForm = (email: string, password: string, username: string, confirmPassword?: string) => {
    const errors: Record<string, string> = {};

    // 이메일 검사
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error!;
    }

    // 사용자명 검사
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        errors.username = usernameValidation.error!;
    }

    // 비밀번호 검사
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error!;
    }

    // 비밀번호 확인
    if (confirmPassword !== undefined && password !== confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
