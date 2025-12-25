# 면접 예상 질문 및 답변

## 1. 아키텍처 및 설계 관련

### Q: 왜 Feature-First 아키텍처를 선택했나요?

**A:** Feature-First 아키텍처를 선택한 이유는 다음과 같습니다:

1. **응집도(Cohesion) 향상**: 하나의 기능과 관련된 모든 코드(컴포넌트, 훅, 타입, API, 상태 등)가 같은 폴더에 위치하여 코드 탐색이 용이합니다.

2. **확장성**: 새로운 기능 추가 시 기존 코드에 영향 없이 `features/` 폴더에 새 디렉토리만 추가하면 됩니다. 예를 들어 `features/essay-builder/`, `features/college-list/` 등을 독립적으로 추가할 수 있습니다.

3. **팀 협업**: 각 기능 단위로 담당자를 지정할 수 있어 코드 충돌이 줄어들고, 코드 리뷰 범위가 명확해집니다.

4. **삭제 용이성**: 기능 삭제 시 해당 폴더만 제거하면 되어 레거시 코드 관리가 쉽습니다.

```
// 기능별 완전한 캡슐화
features/activity-builder/
├── api/           # 해당 기능의 API만
├── components/    # 해당 기능의 컴포넌트만
├── hooks/         # 해당 기능의 훅만
├── stores/        # 해당 기능의 상태만
└── types/         # 해당 기능의 타입만
```

---

### Q: 왜 Zustand를 선택했나요? Redux나 Recoil 대신?

**A:** Zustand를 선택한 이유:

1. **보일러플레이트 최소화**: Redux처럼 action, reducer, dispatch를 분리할 필요 없이 단일 스토어에서 상태와 액션을 함께 정의합니다.

```typescript
// Zustand - 간결한 코드
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Redux - 많은 보일러플레이트 필요
// action types, action creators, reducers, dispatch...
```

2. **번들 사이즈**: Zustand는 약 1KB로 Redux(~7KB) + Redux Toolkit보다 훨씬 가볍습니다.

3. **React 외부에서도 사용 가능**: `getState()`, `setState()`로 React 컴포넌트 밖에서도 상태 접근이 가능합니다.

4. **DevTools 지원**: `devtools` 미들웨어로 Redux DevTools와 동일한 디버깅 경험을 제공합니다.

5. **이 프로젝트 규모에 적합**: Activity Builder 정도의 규모에서 Redux는 과도하고, Zustand가 적절합니다.

---

### Q: React Query를 사용한 이유는?

**A:** 서버 상태 관리의 복잡성을 해결하기 위해 선택했습니다:

1. **캐싱**: 동일한 데이터를 여러 컴포넌트에서 사용할 때 API 중복 호출을 방지합니다.

```typescript
// 여러 컴포넌트에서 호출해도 실제 API는 한 번만 호출
const { data } = useActivities(); // ActivityBuilderLayout에서
const { data } = useActivities(); // ActivityList에서
```

2. **Optimistic Updates**: 사용자 경험 향상을 위해 서버 응답 전에 UI를 먼저 업데이트합니다.

```typescript
onMutate: async (newActivity) => {
  // 1. 이전 데이터 백업
  const previousActivities = queryClient.getQueryData(activityKeys.all);

  // 2. UI 즉시 업데이트
  queryClient.setQueryData(activityKeys.all, (old) => [...old, optimisticActivity]);

  // 3. 롤백용 컨텍스트 반환
  return { previousActivities };
},
onError: (err, newActivity, context) => {
  // 4. 에러 시 롤백
  queryClient.setQueryData(activityKeys.all, context.previousActivities);
},
```

3. **자동 리페칭**: `staleTime`, `refetchOnWindowFocus` 등으로 데이터 신선도를 자동 관리합니다.

4. **로딩/에러 상태**: `isLoading`, `isError`, `isPending` 등 상태를 자동으로 관리합니다.

---

### Q: ky를 사용한 이유는? axios 대신?

**A:** ky를 선택한 이유:

1. **번들 사이즈**: ky는 약 3KB, axios는 약 14KB입니다.

2. **모던 API**: Fetch API 기반으로 Promise 체이닝이 더 자연스럽습니다.

```typescript
// ky - 체이닝이 깔끔
const data = await ky.get('api').json();

// axios - 응답 객체에서 data 추출 필요
const { data } = await axios.get('api');
```

3. **타입 안전성**: 제네릭으로 응답 타입을 지정할 수 있습니다.

```typescript
const data = await apiClient.get('activities').json<ActivityApiResponse[]>();
```

4. **자동 재시도**: GET 요청에 대해 자동 재시도를 설정할 수 있습니다.

---

## 2. 구현 상세 관련

### Q: 스텝 간 이동 제한은 어떻게 구현했나요?

**A:** Sidebar 컴포넌트에서 `canAccessStep` 함수로 구현했습니다:

```typescript
const canAccessStep = (stepId: StepId): boolean => {
  const targetIndex = STEP_ORDER.indexOf(stepId);

  // 첫 번째 스텝은 항상 접근 가능
  if (targetIndex === 0) return true;

  // 이전 스텝들이 모두 완료되어야 접근 가능
  for (let i = 0; i < targetIndex; i++) {
    if (!getStepCompletion(STEP_ORDER[i])) {
      return false;
    }
  }
  return true;
};
```

각 스텝의 완료 여부는 Zod 스키마로 검증합니다:

```typescript
const getStepCompletion = (stepId: StepId): boolean => {
  switch (stepId) {
    case "2-1":
      return activitySchema.shape.name.safeParse(formData.name).success;
    case "2-2":
      return !!formData.category;
    // ...
  }
};
```

---

### Q: 폼 유효성 검사는 어떻게 구현했나요?

**A:** React Hook Form + Zod 조합을 사용했습니다:

1. **Zod 스키마 정의**: 각 필드의 규칙을 선언적으로 정의

```typescript
export const activitySchema = z.object({
  name: z.string().min(1, "Required").max(50, "Max 50 chars"),
  category: z.enum(CATEGORIES, { message: "Required" }),
  description: z.string().min(1, "Required").max(150, "Max 150 chars"),
  hoursPerWeek: z.number().min(0).max(40),
  isLeadership: z.boolean(),
});
```

2. **스텝별 부분 스키마**: 각 스텝에서 해당 필드만 검증

```typescript
export const step2_1Schema = activitySchema.pick({ name: true });
export const step2_4Schema = activitySchema.pick({ description: true });
```

3. **React Hook Form 연동**: `zodResolver`로 스키마 연결

```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(step2_1Schema),
  mode: "onChange", // 실시간 검증
});
```

---

### Q: 다크모드는 어떻게 구현했나요?

**A:** Zustand 스토어에서 `isDark` 상태를 관리하고, 각 컴포넌트에서 조건부 스타일을 적용합니다:

```typescript
// 스토어
const useStore = create((set) => ({
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
}));

// 컴포넌트에서 사용
const { isDark } = useActivityBuilderStore();

<div className={isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
```

`cn()` 유틸리티 함수로 조건부 클래스를 깔끔하게 적용합니다:

```typescript
<Card className={cn(
  "transition-colors duration-300",
  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
)}>
```

---

### Q: Impact Score 계산 로직을 설명해주세요.

**A:** 세 가지 요소를 합산하여 계산합니다:

```typescript
export const calculateImpactScore = (
  tier: Tier,
  isLeadership: boolean,
  hoursPerWeek: number
): number => {
  // 1. 티어 기본 점수 (1-5점)
  let score = TIER_SCORES[tier];

  // 2. 리더십 보너스 (+2점)
  if (isLeadership) score += 2;

  // 3. 시간 투자 보너스 (+1점, 10시간 초과 시)
  if (hoursPerWeek > 10) score += 1;

  return score;
};

// 점수 범위: 1점 (School, 리더십X, 10시간 이하) ~ 8점 (International, 리더십O, 10시간 초과)
```

레벨 분류:
- **1-2점**: Low (회색) - 학교 수준 활동
- **3-4점**: Medium (노랑) - 지역/주 수준 또는 리더십 있는 학교 활동
- **5-6점**: High (초록) - 전국 수준 또는 상위 활동
- **7-8점**: Exceptional (보라) - 국제 수준 + 리더십

---

## 3. 백엔드 관련

### Q: 백엔드 구조를 왜 이렇게 설계했나요?

**A:** 관심사 분리(Separation of Concerns) 원칙을 따랐습니다:

```
app/
├── config.py      # 설정값 중앙화 (CORS, DB URL, 상수)
├── database.py    # DB 연결 로직만
├── models/        # 데이터베이스 모델만
├── schemas/       # API 요청/응답 스키마만
├── services/      # 비즈니스 로직만
└── routes/        # HTTP 엔드포인트만
```

1. **config.py**: 환경별 설정을 한 곳에서 관리하여 배포 시 수정 용이
2. **services/**: 라우트와 분리하여 테스트 용이, 재사용 가능
3. **routes/**: 얇은 레이어로 유지, 요청 검증과 응답만 담당

```python
# routes/activity_routes.py - 얇은 레이어
@router.post("", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    return ActivityService.create(db, activity)  # 로직은 서비스에 위임

# services/activity_service.py - 비즈니스 로직
class ActivityService:
    @staticmethod
    def create(db: Session, activity: ActivityCreate) -> Activity:
        impact_score = ActivityService.calculate_impact_score(...)
        db_activity = Activity(**activity.model_dump(), impact_score=impact_score)
        db.add(db_activity)
        db.commit()
        return db_activity
```

---

### Q: SQLite를 선택한 이유는?

**A:** 과제 요구사항과 개발 편의성을 고려했습니다:

1. **요구사항 충족**: 과제에서 SQLite 또는 DuckDB를 권장
2. **제로 설정**: 별도 DB 서버 설치 불필요, 파일 하나로 동작
3. **개발 속도**: 로컬 개발에 최적화
4. **이식성**: 프로젝트 폴더에 DB 파일 포함, 어디서든 실행 가능

프로덕션에서는 PostgreSQL 등으로 교체할 수 있도록 SQLAlchemy ORM을 사용하여 DB 독립적으로 구현했습니다.

---

## 4. 성능 및 최적화

### Q: 성능 최적화는 어떻게 했나요?

**A:** 여러 레벨에서 최적화를 적용했습니다:

1. **React Query 캐싱**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
      refetchOnWindowFocus: false, // 탭 전환 시 리페칭 방지
    },
  },
});
```

2. **Optimistic Updates**: 서버 응답 대기 없이 즉시 UI 업데이트

3. **Step별 컴포넌트 분리**: 각 스텝이 독립적으로 렌더링, 다른 스텝 변경 시 리렌더링 방지

4. **Zustand 선택적 구독**: 필요한 상태만 구독하여 불필요한 리렌더링 방지
```typescript
// 전체 스토어 대신 필요한 것만 선택
const currentStep = useActivityBuilderStore((state) => state.currentStep);
```

---

### Q: 더 개선할 수 있는 부분이 있나요?

**A:** 시간이 더 있다면:

1. **React.memo, useMemo, useCallback**: 무거운 컴포넌트나 계산에 적용
2. **가상화**: 활동 목록이 많아지면 `react-window`로 가상 스크롤 적용
3. **코드 스플리팅**: 스텝별 lazy loading
4. **이미지 최적화**: 활동에 이미지 첨부 기능 추가 시 lazy loading, WebP 포맷
5. **Service Worker**: 오프라인 지원, 백그라운드 동기화

---

## 5. 테스트 관련

### Q: 테스트는 어떻게 작성하실 건가요?

**A:** 시간이 있었다면 다음과 같이 구성했을 것입니다:

1. **단위 테스트 (Vitest)**:
```typescript
// utils 테스트
describe('calculateImpactScore', () => {
  it('should return 1 for School tier without leadership', () => {
    expect(calculateImpactScore('School', false, 5)).toBe(1);
  });

  it('should add 2 points for leadership', () => {
    expect(calculateImpactScore('School', true, 5)).toBe(3);
  });
});
```

2. **컴포넌트 테스트 (Testing Library)**:
```typescript
describe('Step2_1', () => {
  it('should show error when name is empty', async () => {
    render(<Step2_1 />);
    fireEvent.click(screen.getByText('Continue'));
    expect(await screen.findByText('Activity name is required')).toBeInTheDocument();
  });
});
```

3. **E2E 테스트 (Playwright)**:
```typescript
test('complete activity flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="name"]', 'Soccer Team');
  await page.click('text=Continue');
  // ... 전체 플로우 테스트
});
```

---

## 6. 기타

### Q: 이 과제에서 가장 어려웠던 부분은?

**A:** 두 가지가 어려웠습니다:

1. **Radix UI Checkbox 무한 루프**: shadcn/ui의 Checkbox 컴포넌트에서 `onCheckedChange`와 부모 `onClick` 이벤트가 동시에 발생하여 무한 업데이트 루프가 발생했습니다. 커스텀 체크박스로 교체하여 해결했습니다.

2. **Zod v4 호환성**: Zod v4에서 `z.enum()`의 에러 메시지 설정 방식이 변경되어 `required_error` 대신 `message`를 사용해야 했습니다.

### Q: 시간이 더 있었다면 무엇을 추가했을까요?

**A:**
1. **테스트 코드**: 단위, 통합, E2E 테스트
2. **에러 바운더리**: 전역 에러 처리
3. **토스트 알림**: 성공/실패 피드백
4. **로딩 스켈레톤**: 더 나은 로딩 UX
5. **활동 드래그 앤 드롭**: 순서 변경 기능
6. **활동 필터/검색**: 많은 활동 관리
7. **데이터 내보내기**: CSV/PDF 다운로드
8. **접근성 개선**: 키보드 네비게이션, 스크린 리더 지원

### Q: 코드 품질을 어떻게 유지하나요?

**A:**
1. **ESLint + Prettier**: 일관된 코드 스타일
2. **TypeScript strict mode**: 타입 안전성
3. **Zod 스키마**: 런타임 데이터 검증
4. **Feature-First 구조**: 관심사 분리
5. **명확한 네이밍**: 함수, 변수, 파일 이름에 의미 부여
