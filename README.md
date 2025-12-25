# EdMission Activity Builder

EdMission 대학 지원 플랫폼을 위한 Activity Builder 기능입니다. 학생들이 비교과 활동을 프로필에 추가하고, 티어별로 분류하여 합격 확률 계산에 활용합니다.

## 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS v4** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **Zustand** - 전역 상태 관리
- **React Hook Form** + **Zod** - 폼 관리 및 유효성 검사
- **TanStack Query (React Query)** - 서버 상태 관리, 캐싱, Optimistic Updates
- **ky** - HTTP 클라이언트

### Backend
- **Python 3.11+**
- **FastAPI** - 웹 프레임워크
- **SQLAlchemy** - ORM
- **SQLite** - 데이터베이스
- **Pydantic** - 데이터 검증

## 프로젝트 구조

```
edmission-report/
├── frontend/
│   └── src/
│       ├── components/ui/          # shadcn/ui 컴포넌트
│       ├── features/
│       │   └── activity-builder/   # Activity Builder 기능
│       │       ├── api/            # API 호출 함수
│       │       ├── components/     # UI 컴포넌트
│       │       ├── constants/      # 상수 정의
│       │       ├── hooks/          # React Query 커스텀 훅
│       │       ├── schemas/        # Zod 스키마
│       │       ├── stores/         # Zustand 스토어
│       │       ├── steps/          # 스텝별 컴포넌트 (2-1 ~ 3-1)
│       │       ├── types/          # TypeScript 타입
│       │       └── utils/          # 유틸리티 함수
│       └── lib/
│           └── api/                # API 클라이언트 설정
│
└── backend/
    ├── app/
    │   ├── config.py               # 설정 및 상수
    │   ├── database.py             # DB 연결
    │   ├── models/                 # SQLAlchemy 모델
    │   ├── schemas/                # Pydantic 스키마
    │   ├── services/               # 비즈니스 로직
    │   └── routes/                 # API 라우트
    ├── main.py                     # FastAPI 앱 엔트리포인트
    └── requirements.txt            # Python 의존성
```

## 로컬 개발환경 셋업 (macOS)

### 1. 사전 요구사항

```bash
# Node.js 18+ 설치 (Homebrew 사용)
brew install node

# Python 3.11+ 설치
brew install python@3.11

# pnpm 설치 (선택사항, npm도 가능)
npm install -g pnpm
```

### 2. 프로젝트 클론

```bash
git clone <repository-url>
cd edmission-report
```

### 3. Backend 설정

```bash
cd backend

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행 (http://localhost:8000)
uvicorn main:app --reload
```

### 4. Frontend 설정

```bash
cd frontend

# 의존성 설치
pnpm install
# 또는
npm install

# 개발 서버 실행 (http://localhost:5173)
pnpm dev
# 또는
npm run dev
```

### 5. 접속 확인

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API 문서 (Swagger): http://localhost:8000/docs

## 구현된 기능

### Step 2-1: Activity Name
- 활동명 입력 (필수, 최대 50자)
- 실시간 글자수 카운터
- 유효성 검사 (빈 값 체크)

### Step 2-2: Category
- 카테고리 선택 (Sports, Arts, Academic, Community Service, Leadership, Other)
- 카드 형태 UI로 시각적 선택

### Step 2-3: Tier
- 티어 선택 (School, Regional, State, National, International)
- 티어별 점수 표시 및 색상 구분

### Step 2-4: Description
- 설명 입력 (필수, 최대 150자)
- 실시간 글자수 카운터
- 제한 근접 시 색상 변경 (노랑 → 빨강)

### Step 2-5: Details
- 주당 시간 입력 (0-40 범위)
- 리더십 직책 체크박스
- 보너스 포인트 실시간 계산

### Step 3-1: Review & Submit
- 입력 정보 전체 검토
- Impact Score 계산 및 표시
- 서버 제출 (생성/수정)

### 공통 기능
- 왼쪽 사이드바에 스텝 네비게이션
- 스텝 완료 상태 표시 (체크 아이콘)
- 이전 스텝 미완료 시 다음 스텝 접근 불가
- 다크모드 지원
- 활동 목록 CRUD (생성, 조회, 수정, 삭제)
- Optimistic Updates (즉각적인 UI 반영)

## Impact Score 계산 로직

```typescript
// 티어 점수
const TIER_SCORES = {
  School: 1,
  Regional: 2,
  State: 3,
  National: 4,
  International: 5,
};

// 계산 공식
let score = TIER_SCORES[tier];
if (isLeadership) score += 2;      // 리더십 보너스
if (hoursPerWeek > 10) score += 1; // 시간 투자 보너스

// 레벨 분류
// 1-2: Low (회색)
// 3-4: Medium (노랑)
// 5-6: High (초록)
// 7+:  Exceptional (보라)
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/activities` | 모든 활동 조회 |
| GET | `/activities/{id}` | 특정 활동 조회 |
| POST | `/activities` | 활동 생성 |
| PUT | `/activities/{id}` | 활동 수정 |
| DELETE | `/activities/{id}` | 활동 삭제 |
