# CAPS v4 Frontend

CAPS(Computer Algorithm Problem Solving) 클럽의 프론트엔드 웹 애플리케이션입니다.

## 📋 프로젝트 소개

CAPS는 다양한 전공의 학생들이 함께 활동하며 전공간의 경계를 허물고, 창의적 시각으로 복잡한 문제에 접근할 수 있는 프로그래밍 학술 활동을 추구하는 동아리입니다.

이 프로젝트는 CAPS 클럽의 공식 웹사이트로, 다음과 같은 기능을 제공합니다:

- **캡스위키**: 클럽 관련 정보를 공유하는 위키 시스템
- **이벤트 관리**: 행사 및 이벤트 생성, 참여, 관리
- **스터디**: 스터디 그룹 생성 및 관리
- **장부게시판**: 재무 관련 게시판
- **갤러리**: 사진 및 자료 공유
- **랭킹**: 회원 활동 랭킹 시스템
- **투표**: 다양한 투표 기능
- **문의/신고**: 사용자 문의 및 신고 접수

## 🛠 기술 스택

- **프레임워크**: React 18.3.1
- **빌드 도구**: Vite 5.4.0
- **언어**: TypeScript, JavaScript
- **스타일링**: Tailwind CSS 3.4.13
- **상태 관리**: React Query (@tanstack/react-query)
- **라우팅**: React Router DOM 6.26.0
- **HTTP 클라이언트**: Axios 1.8.4
- **UI 컴포넌트**: Ant Design 5.24.7
- **아이콘**: Lucide React, React Icons
- **애니메이션**: Framer Motion
- **API 클라이언트 생성**: Orval 8.0.3

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
VITE_API_HOST=https://api.example.com
VITE_LAMBDA_URL=https://lambda.example.com  # 선택사항 (S3 파일 업로드/삭제용)
```

### 개발 서버 실행

```bash
# 일반 개발 서버 (HTTP)
npm run dev

# HTTPS 개발 서버 (SSL 인증서 필요)
npm run devs
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

```bash
# 빌드 미리보기
npm run preview
```

## 📡 API 클라이언트 생성 (Orval)

이 프로젝트는 [Orval](https://orval.dev/)을 사용하여 OpenAPI 스펙으로부터 타입 안전한 API 클라이언트를 자동 생성합니다.

### API 클라이언트 생성

```bash
# API 클라이언트 생성 (한 번만 실행)
npm run orval:gen

# API 클라이언트 생성 및 감시 모드 (OpenAPI 스펙 변경 시 자동 재생성)
npm run orval
```

생성된 API 클라이언트는 `src/api/generated/capsApi.ts`에 위치합니다.

### Orval 워크플로우

1. `npm run openapi:fetch`: 서버에서 OpenAPI 스펙 다운로드
2. `npm run openapi:patch`: OpenAPI 스펙 패치 (검증 오류 수정)
3. `orval --config orval.config.cjs`: API 클라이언트 생성

## 📁 프로젝트 구조

```
caps-client/
├── src/
│   ├── api/
│   │   └── generated/          # Orval로 생성된 API 클라이언트
│   ├── assets/                 # 정적 자산 (이미지, 아이콘 등)
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── BoardList/          # 게시판 목록
│   │   ├── BoardView/          # 게시판 상세보기
│   │   ├── Event/               # 이벤트 관련 컴포넌트
│   │   ├── Login/               # 로그인 모달
│   │   ├── MainPage/            # 메인 페이지 컴포넌트
│   │   ├── WIKI/                # 위키 관련 컴포넌트
│   │   └── ...
│   ├── contexts/                # React Context
│   ├── data/                    # 정적 데이터
│   ├── hooks/                   # 커스텀 훅
│   ├── pages/                   # 페이지 컴포넌트
│   ├── types/                   # TypeScript 타입 정의
│   ├── utils/                   # 유틸리티 함수
│   └── App.tsx                  # 메인 앱 컴포넌트
├── scripts/
│   ├── fetch-openapi.mjs        # OpenAPI 스펙 다운로드 스크립트
│   └── patch-openapi.mjs        # OpenAPI 스펙 패치 스크립트
├── orval.config.cjs             # Orval 설정 파일
└── package.json
```

## 🔐 인증

이 프로젝트는 카카오 OAuth2를 통한 소셜 로그인을 지원합니다. 인증 토큰은 HttpOnly 쿠키로 관리됩니다.

### 로그인 플로우

1. 사용자가 카카오 로그인 버튼 클릭
2. 카카오 OAuth2 인증 페이지로 리다이렉트
3. 인증 완료 후 콜백 URL로 리다이렉트
4. 서버에서 JWT 토큰을 HttpOnly 쿠키로 설정
5. 클라이언트에서 `/api/v1/members/me` 엔드포인트로 사용자 정보 확인

## 🛡 보호된 라우트

일부 페이지는 로그인한 사용자만 접근할 수 있습니다. `ProtectedRoute` 컴포넌트를 사용하여 보호할 수 있습니다:

```tsx
<ProtectedRoute>
  <ReportPage />
</ProtectedRoute>
```

## 📝 주요 기능

### 위키 시스템
- 위키 문서 작성 및 편집
- 위키 히스토리 조회 및 비교
- 마크다운 지원

### 이벤트 관리
- 이벤트 생성 및 수정
- 이벤트 참여 관리
- 이벤트 상세 정보 조회

### 스터디
- 스터디 그룹 생성 및 관리
- 스터디 참여자 관리
- 스터디 일정 관리

### 장부게시판
- 재무 관련 게시글 작성 및 조회
- 엑셀 파일 업로드 및 다운로드

### 문의/신고
- 카테고리별 문의 및 신고 접수
- 파일 첨부 기능 (S3 presigned URL 사용)

## 🧪 개발 가이드

### 코드 스타일

- ESLint를 사용하여 코드 스타일을 검사합니다.
- TypeScript를 사용하는 것을 권장합니다.

```bash
npm run lint
```

### 컴포넌트 작성 가이드

- 재사용 가능한 컴포넌트는 `src/components/`에 작성합니다.
- 페이지 컴포넌트는 `src/pages/`에 작성합니다.
- 커스텀 훅은 `src/hooks/`에 작성합니다.

## 📄 라이선스

이 프로젝트는 CAPS 클럽의 내부 프로젝트입니다.

## 👥 기여자

CAPS 클럽 회원들
