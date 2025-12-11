## 프로젝트 구조

mini-community/
├── public/
│ ├── favicon.ico
│ └── images/
│ └── default-avatar.png
│
├── src/
│ ├── app/
│ │ ├── layout.tsx # 루트 레이아웃
│ │ ├── page.tsx # 홈 페이지
│ │ ├── globals.css # 글로벌 CSS
│ │ │
│ │ ├── (auth)/ # 인증 관련 라우트 그룹
│ │ │ ├── login/
│ │ │ │ └── page.tsx # 로그인 페이지
│ │ │ └── signup/
│ │ │ └── page.tsx # 회원가입 페이지
│ │ │
│ │ ├── posts/ # 게시글 관련
│ │ │ ├── page.tsx # 게시글 목록
│ │ │ ├── [id]/
│ │ │ │ └── page.tsx # 게시글 상세
│ │ │ └── write/
│ │ │ └── page.tsx # 글쓰기
│ │ │
│ │ ├── profile/
│ │ │ └── page.tsx # 마이페이지
│ │ │
│ │ ├── trending/
│ │ │ └── page.tsx # 인기글 페이지
│ │ │
│ │ └── notifications/
│ │ └── page.tsx # 알림 페이지
│ │
│ ├── components/ # 재사용 컴포넌트
│ │ ├── layout/
│ │ │ ├── Header.tsx # 헤더
│ │ │ ├── Footer.tsx # 푸터
│ │ │ ├── Sidebar.tsx # 사이드바
│ │ │ └── MobileMenu.tsx # 모바일 메뉴
│ │ │
│ │ ├── header/
│ │ │ ├── Logo.tsx # W 로고
│ │ │ ├── SearchBar.tsx # 검색바
│ │ │ ├── UserMenu.tsx # 유저 메뉴
│ │ │ └── NotificationButton.tsx # 알림 버튼
│ │ │
│ │ ├── post/
│ │ │ ├── PostCard.tsx # 게시글 카드
│ │ │ ├── PostList.tsx # 게시글 리스트
│ │ │ ├── PostDetail.tsx # 게시글 상세
│ │ │ ├── PostEditor.tsx # 글쓰기 에디터
│ │ │ └── PostActions.tsx # 좋아요, 북마크 등
│ │ │
│ │ ├── comment/
│ │ │ ├── CommentList.tsx # 댓글 리스트
│ │ │ ├── CommentItem.tsx # 댓글 아이템
│ │ │ └── CommentForm.tsx # 댓글 작성 폼
│ │ │
│ │ ├── ui/ # 공통 UI 컴포넌트
│ │ │ ├── Button.tsx # 버튼
│ │ │ ├── Input.tsx # 인풋
│ │ │ ├── Textarea.tsx # 텍스트에리어
│ │ │ ├── Modal.tsx # 모달
│ │ │ ├── Dropdown.tsx # 드롭다운
│ │ │ ├── Tabs.tsx # 탭
│ │ │ ├── Avatar.tsx # 아바타
│ │ │ └── Loading.tsx # 로딩 스피너
│ │ │
│ │ └── common/
│ │ ├── InfiniteScroll.tsx # 무한 스크롤
│ │ ├── ImageUpload.tsx # 이미지 업로드
│ │ └── ErrorBoundary.tsx # 에러 바운더리
│ │
│ ├── hooks/ # 커스텀 훅
│ │ ├── useAuth.ts # 인증 관련 훅
│ │ ├── usePosts.ts # 게시글 관련 훅
│ │ ├── useComments.ts # 댓글 관련 훅
│ │ ├── useInfiniteScroll.ts # 무한 스크롤 훅
│ │ ├── useDebounce.ts # 디바운스 훅
│ │ └── useImageUpload.ts # 이미지 업로드 훅
│ │
│ ├── store/ # Zustand 상태 관리
│ │ ├── authStore.ts # 인증 상태
│ │ ├── postStore.ts # 게시글 상태
│ │ ├── uiStore.ts # UI 상태 (모달, 토스트 등)
│ │ └── index.ts # Store export
│ │
│ ├── lib/ # 유틸리티 & API
│ │ ├── supabase/
│ │ │ ├── client.ts # Supabase 클라이언트
│ │ │ ├── auth.ts # 인증 API
│ │ │ ├── posts.ts # 게시글 API
│ │ │ ├── comments.ts # 댓글 API
│ │ │ ├── likes.ts # 좋아요 API
│ │ │ ├── storage.ts # 스토리지 API
│ │ │ └── profiles.ts # 프로필 API
│ │ │
│ │ ├── react-query/
│ │ │ ├── queryClient.ts # Query Client 설정
│ │ │ ├── queries.ts # Query 함수들
│ │ │ └── mutations.ts # Mutation 함수들
│ │ │
│ │ └── utils/
│ │ ├── formatDate.ts # 날짜 포맷
│ │ ├── truncateText.ts # 텍스트 자르기
│ │ ├── validateEmail.ts # 이메일 검증
│ │ └── constants.ts # 상수 정의
│ │
│ ├── types/ # TypeScript 타입
│ │ ├── index.ts # 메인 타입 export
│ │ ├── post.ts # 게시글 타입
│ │ ├── comment.ts # 댓글 타입
│ │ ├── user.ts # 유저 타입
│ │ └── api.ts # API 응답 타입
│ │
│ └── styles/ # 스타일
│ ├── globals.css # 글로벌 스타일
│ └── themes.ts # 테마 설정
│
├── .env.local # 환경 변수
├── .env.example # 환경 변수 예시
├── .gitignore # Git 무시 파일
├── next.config.js # Next.js 설정
├── tailwind.config.ts # Tailwind 설정
├── tsconfig.json # TypeScript 설정
├── package.json # 패키지 정보
└── README.md # 프로젝트 설명
# w-community
