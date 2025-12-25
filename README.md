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

---

## Follow-Up Questions

### Part A: Code Review & Optimization

**1. What's the issue with this if-statement chain? How would you refactor it?**

if문을 5번 다 체크하는 게 비효율적입니다. 그리고 새로운 티어가 추가되면 코드를 직접 수정해야 해서 유지보수가 어렵습니다.

객체 룩업으로 바꾸면 됩니다:

```typescript
const TIER_SCORES = {
  School: 1,
  Regional: 2,
  State: 3,
  National: 4,
  International: 5,
};

const calculateImpactScore = (tier, isLeadership, hours) => {
  let score = TIER_SCORES[tier] ?? 0;
  if (isLeadership) score += 2;
  if (hours > 10) score += 1;
  return score;
};
```

한 번에 값을 가져올 수 있고, 티어 추가할 때도 객체만 수정하면 됩니다.

**2. This function is called inside the form's onChange handler. What's the performance concern?**

키 입력할 때마다 함수가 호출되니까 불필요한 연산이 많이 발생합니다. 특히 tier, isLeadership, hours 값이 안 바뀌었는데도 매번 다시 계산하게 됩니다.

**3. How would you memoize this calculation?**

`useMemo`로 감싸서 의존성이 바뀔 때만 재계산하면 됩니다:

```typescript
const impactScore = useMemo(
  () => calculateImpactScore(formData.tier, formData.isLeadership, formData.hoursPerWeek),
  [formData.tier, formData.isLeadership, formData.hoursPerWeek]
);
```

Step3_1 컴포넌트에서 이렇게 구현했습니다.

참고로 React 19부터는 React Compiler가 도입되어서 `useMemo`, `useCallback`, `memo` 같은 메모이제이션을 자동으로 해줍니다. 수동으로 최적화 코드를 작성할 필요가 줄어들고, 의존성 배열 실수로 인한 버그도 방지할 수 있습니다.

---

### Part B: State Management

**1. What are 3 approaches to share this state?**

- **Context API**: React 내장이라 별도 설치가 필요 없는데, 상태가 바뀌면 하위 컴포넌트가 전부 리렌더링되는 문제가 있습니다
- **Redux**: DevTools 좋고 대규모 프로젝트에 적합한데, 보일러플레이트가 많습니다
- **Zustand**: 코드가 간단하고 번들 사이즈도 1KB 정도로 작습니다. 필요한 상태만 구독할 수 있어서 최적화도 쉽습니다

**2. For Edmission's scale, which would you choose and why?**

Zustand랑 React Query를 같이 사용할 것 같습니다.

활동 데이터는 서버에서 오는 거라서 React Query로 관리하고, UI 상태는 Zustand로 관리하면 됩니다. React Query가 캐싱을 해주고, 여러 페이지에서 같은 queryKey를 쓰면 자동으로 데이터가 공유됩니다. 별도로 동기화 로직을 짤 필요가 없습니다.

**3. How would you handle optimistic updates when saving to the backend?**

React Query의 `onMutate`에서 UI를 먼저 업데이트하고, 실패하면 `onError`에서 롤백하면 됩니다:

```typescript
onMutate: async (newActivity) => {
  const previous = queryClient.getQueryData(['activities']);
  queryClient.setQueryData(['activities'], old => [...old, newActivity]);
  return { previous };
},
onError: (err, newActivity, context) => {
  queryClient.setQueryData(['activities'], context.previous);
}
```

---

### Part C: Accessibility

**1. What's wrong with this markup?**

label이 없습니다. placeholder만 있으면 스크린 리더가 이 필드가 뭔지 알 수 없습니다.

```tsx
<label htmlFor="activity-name">Activity name</label>
<input
  id="activity-name"
  type="text"
  placeholder="Activity name"
  aria-invalid={!!error}
/>
```

label을 연결해주면 됩니다.

**2. How would you make the dynamic color badge accessible to screen readers?**

`aria-label`로 점수랑 레벨을 같이 알려주면 됩니다:

```tsx
<Badge aria-label={`Impact Score: ${score}점, ${level} 레벨`}>
  {score} pts
</Badge>
```

**3. The delete button only has an icon. What should you add?**

`aria-label` 추가하면 됩니다:

```tsx
<Button aria-label={`${activity.name} 삭제`}>
  <Trash2 />
</Button>
```

---

### Part D: Real-World Scenarios

**Scenario 1: Component re-renders every keystroke with 50 activities**

상태가 상위 컴포넌트에 있어서 키 입력할 때마다 전체 리스트가 다시 그려지는 것 같습니다.

편집하는 항목만 로컬 상태로 분리하고, 각 카드를 `React.memo`로 감싸면 됩니다. 50개 이상이면 `@tanstack/react-virtual` 같은 가상화 라이브러리를 쓰는 것도 방법입니다. 실제로 TanStack Table + React Virtual 조합으로 무한스크롤 테이블을 개발한 경험이 있는데, 수천 개 row도 문제없이 렌더링됩니다.

**Scenario 2: Drag-and-drop reordering library choice**

`@dnd-kit/core`를 사용할 것 같습니다. `react-beautiful-dnd`는 써본 적이 없고, dnd-kit은 예전에 써본 적이 있어서 익숙합니다. 번들 사이즈도 더 작습니다.
