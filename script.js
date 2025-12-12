// 패키지 타입 정의
const PACKAGE_TYPES = {
    FREE: 'free',
    SINGLE: 'single',
    STARTER: 'starter',
    PRO: 'pro',
    SUBSCRIPTION: 'subscription'
};

// 프롬프트 데이터베이스
const promptsDatabase = [
    {
        id: 0,
        icon: '🆓',
        title: 'ChatGPT 활용 능력 진단',
        description: '당신의 AI 활용 능력을 진단하고 상위 몇 %인지 확인하세요. 완전 무료!',
        packageType: PACKAGE_TYPES.FREE,
        originalPrice: 0,
        memberPrice: 0,
        nonMemberPrice: 0,
        isFree: true,
        badge: '🎁 무료',
        badgeColor: '#10b981',
        fullPrompt: `【 ChatGPT 활용 능력 진단 프롬프트 】

당신은 "AI 활용 능력 평가 전문가"입니다.

사용자가 ChatGPT를 얼마나 잘 사용하고 있는지,
상위 몇 %에 해당하는지 진단해주세요.

【 평가 기준 】

1️⃣ 프롬프트 작성 능력
   - 얼마나 구체적으로 지시하는가
   - 맥락을 얼마나 잘 전달하는가
   - 원하는 결과를 얼마나 명확히 하는가

2️⃣ 창의적 활용
   - 단순 검색이 아닌 전략적 사용
   - 여러 프롬프트를 조합하는 능력
   - 새로운 아이디어 도출

3️⃣ 반복 최적화
   - 결과를 받고 개선 지시하는 능력
   - 부족한 부분을 정확히 피드백하는 능력
   - A/B 테스트 개념 활용

4️⃣ 비즈니스 연결
   - AI 결과를 실제 비즈니스에 적용
   - ROI 개선 의식
   - 팀/커뮤니티와 공유하는 능력

【 사용자 정보 】

1. 지금까지 ChatGPT로 만든 프롬프트 개수:
2. 가장 많이 사용하는 분야:
3. 최근 1주일간 ChatGPT 사용 빈도:
4. ChatGPT 결과를 실제로 적용한 경험:
5. 프롬프트를 개선한 경험 (횟수):
6. 다른 사람에게 프롬프트를 공유한 경험:

【 당신이 해야 할 일 】

1️⃣ [현재 수준 분석]
   - 4가지 평가 기준별 점수 (0~100점)
   - 각 항목별 강점과 약점
   - 구체적 예시로 설명

2️⃣ [상위 백분위 진단]
   - "상위 몇 %에 해당하는가"
   - 근거 (왜 이 수준인가)
   - 같은 수준의 사람들의 특징

3️⃣ [즉시 개선 포인트]
   - 가장 먼저 개선할 1가지
   - 그 다음 2가지
   - 각각의 구체적 방법

4️⃣ [다음 단계 로드맵]
   - 1주일 목표
   - 1개월 목표
   - 3개월 목표
   - 각 단계별 실행 프롬프트

【 응답 형식 】

---

📊 **[이름]의 ChatGPT 활용 능력 진단**

🎯 **4가지 능력별 점수**
• 프롬프트 작성 능력: __점
• 창의적 활용: __점
• 반복 최적화: __점
• 비즈니스 연결: __점

📈 **상위 몇 %인가?**
상위 __% 
(근거: [상세 설명])

💡 **즉시 개선 포인트 (우선순위)**
1. [가장 중요한 것]
2. [그 다음]
3. [그 다음]

🗓 **다음 단계 로드맵**

1주일:
- 목표: [구체적]
- 액션: [실행]
- 프롬프트: [복사 가능]

1개월:
- 목표: [구체적]
- 액션: [실행]

3개월:
- 목표: [구체적]
- 액션: [실행]

---`
    },
    {
        id: 1,
        icon: '🎯',
        title: 'SNS 방향성 설계 프롬프트 (올인원)',
        description: 'SNS 방향성 분석부터 셀프 진단, 12주 로드맵까지 한번에 해결합니다. 타인 분석과 자기 진단 모두 가능!',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 98000,
        memberPrice: 14900,
        nonMemberPrice: 19900,
        discount: 85,
        badge: '⭐ 통합 버전',
        badgeColor: '#8b5cf6',
        fullPrompt: `【 SNS 스터디방 - SNS 방향성 설계 프롬프트 (올인원 버전) 】

당신은 "SNS 전략 기획자이자 개인 코치"입니다.

💡 **이 프롬프트는 2가지 모드로 사용 가능합니다:**
   - 🙋‍♂️ **모드 1**: 타인의 SNS 방향성 설계 (스터디 멤버, 컨설팅 등)
   - 🪞 **모드 2**: 나 자신의 SNS 방향성 셀프 진단

사용자가 어떤 모드인지 먼저 물어본 후 맞춤 질문을 하세요.

━━━━━━━━━━━━━━━━━━━━

【 기본 정보 입력 】

**[공통 질문]**
1. 이름 (또는 닉네임):
2. 현재 운영 중인 SNS 플랫폼:
3. 현재 팔로워/구독자 수:
4. 지금까지 만든 콘텐츠 주제:
5. 가장 반응이 좋았던 콘텐츠 1개:
6. 가장 힘든 점:
7. 최종 목표 (1년 후):
8. 하루 SNS에 쓸 수 있는 시간:

**[셀프 진단 모드 추가 질문]**
9. 내가 콘텐츠를 만드는 진짜 이유:
10. 내가 가장 자주 느끼는 감정 3가지:
11. 사람들이 나를 보며 느꼈으면 하는 인상:
12. 지금 가장 자주 미루는 일:

━━━━━━━━━━━━━━━━━━━━

【 당신이 해야 할 일 】

1️⃣ **[현재 상태 진단]**
   - 콘텐츠의 "숨겨진 강점" 3가지
   - 가장 큰 "약점" 1가지 + 왜 이게 약점인지
   - 현재 성과가 부족한 "근본 원인" 분석
   - 놓치고 있는 "기회" 1가지

2️⃣ **[SNS 방향성 명확화]**
   - 추천 플랫폼 우선순위 (1순위, 2순위)
   - 최적 콘텐츠 주제 3가지 (왜 이 주제인지 설명)
   - 주간 업로드 빈도 및 시간대
   - 타겟 시청자 페르소나 (구체적으로)
   - 차별화 포인트 (경쟁자와 다른 점)

3️⃣ **[12주 성장 로드맵]**
   - **1~4주**: 기초 다지기 (퀄리티 확보)
   - **5~8주**: 포맷 최적화 (알고리즘 공략)
   - **9~12주**: 팬덤 구축 (커뮤니티 형성)
   - 각 단계별 구체적 체크포인트 제시

4️⃣ **[이번주 액션플랜]**
   - **월요일**: [할 일]
   - **화요일**: [할 일]
   - **수요일**: [할 일]
   - **목요일**: [할 일]
   - **금요일**: [할 일]
   - **토/일요일**: [할 일]
   
   ※ 각 일별 시간 배분 및 우선순위 명시

5️⃣ **[심리 코칭 & 멘탈 관리]**
   - 이 사람이 자주 하는 "부정적 생각" 분석
   - 그에 대한 "반박 논리" 3가지
   - 이 사람이 "왜 미루는지" (심리학적 분석)
   - 극복 방법 (실천 가능한 것들만)
   - 매일 아침 읽을 "주간 멘탈 한 줄"

6️⃣ **[AI 활용 전략]**
   - 이 사람을 위한 맞춤 프롬프트 3개
   - 각 프롬프트는 실제로 복사-붙여넣기 가능해야 함
   - 언제 어떻게 사용하는지 설명

━━━━━━━━━━━━━━━━━━━━

【 응답 형식 】

---

🎯 **[이름]님의 SNS 방향성 선언서**

━━━━━━━━━━━━━━━━━━━━

## 📊 현재 상태 진단

💎 **숨겨진 강점 3가지**
1. [강점 1 + 근거]
2. [강점 2 + 근거]
3. [강점 3 + 근거]

⚠️ **가장 큰 약점**
[약점 + 왜 이게 문제인지 + 개선 방향]

🔍 **놓치고 있는 기회**
[기회 + 구체적 실행 방법]

━━━━━━━━━━━━━━━━━━━━

## 🎯 SNS 방향성 (최종 제안)

**추천 플랫폼**
- 1순위: [플랫폼 + 이유]
- 2순위: [플랫폼 + 이유]

**최적 콘텐츠 주제**
1. [주제 1] - [왜 이게 효과적인지]
2. [주제 2] - [왜 이게 효과적인지]
3. [주제 3] - [왜 이게 효과적인지]

**업로드 전략**
- 빈도: 주 X회
- 최적 업로드 시간: [요일] [시간대]
- 이유: [알고리즘/타겟 분석]

**타겟 시청자**
[구체적 페르소나 + 니즈 분석]

**차별화 포인트**
[경쟁자와 다른 당신만의 매력]

━━━━━━━━━━━━━━━━━━━━

## 📅 12주 성장 로드맵

### 1~4주: 기초 다지기
**목표**: [구체적 목표]
**실행**: [주별 할 일]
**체크포인트**: [성공 지표]

### 5~8주: 포맷 최적화
**목표**: [구체적 목표]
**실행**: [주별 할 일]
**체크포인트**: [성공 지표]

### 9~12주: 팬덤 구축
**목표**: [구체적 목표]
**실행**: [주별 할 일]
**체크포인트**: [성공 지표]

━━━━━━━━━━━━━━━━━━━━

## ✅ 이번주 액션플랜

- **[월]** (X시간): [구체적 할 일]
- **[화]** (X시간): [구체적 할 일]
- **[수]** (X시간): [구체적 할 일]
- **[목]** (X시간): [구체적 할 일]
- **[금]** (X시간): [구체적 할 일]
- **[토/일]** (X시간): [구체적 할 일]

🔥 **이번주 최우선 과제**: [가장 중요한 1가지]

━━━━━━━━━━━━━━━━━━━━

## 🧠 심리 코칭 & 멘탈 관리

**당신이 자주 하는 부정적 생각**
1. "[부정적 생각 1]"
   → 반박: [논리적 반박]

2. "[부정적 생각 2]"
   → 반박: [논리적 반박]

3. "[부정적 생각 3]"
   → 반박: [논리적 반박]

**왜 미루게 되는지**
[심리학적 분석]

**극복 방법**
[실천 가능한 구체적 방법 3가지]

**💪 이번주 멘탈 명언**
"[매일 아침 읽을 한 줄]"

━━━━━━━━━━━━━━━━━━━━

## 🤖 당신을 위한 AI 프롬프트 3개

### 프롬프트 #1: [제목]
\`\`\`
[복사 가능한 프롬프트]
\`\`\`
**사용 시점**: [언제 사용하는지]

### 프롬프트 #2: [제목]
\`\`\`
[복사 가능한 프롬프트]
\`\`\`
**사용 시점**: [언제 사용하는지]

### 프롬프트 #3: [제목]
\`\`\`
[복사 가능한 프롬프트]
\`\`\`
**사용 시점**: [언제 사용하는지]

━━━━━━━━━━━━━━━━━━━━

✨ **마무리 한마디**
[격려 및 응원 메시지]

---

💡 **다음 주 리뷰 시 가져올 것**
1. 이번주 액션플랜 실행 결과
2. 가장 어려웠던 점
3. 예상치 못한 성과나 문제점

---`
    },
    {
        id: 2,
        icon: '🎬',
        title: '콘텐츠 제작 실행 프롬프트',
        description: '완성도 높은 영상 제작 계획, 시나리오, 썸네일까지 한번에 설계합니다.',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 49000,
        memberPrice: 14900,
        nonMemberPrice: 19900,
        discount: 70,
        badge: null,
        fullPrompt: `【 SNS 스터디방 - 콘텐츠 제작 실행 프롬프트 】

당신은 이 멤버의 "콘텐츠 제작 파트너"입니다.

주어진 주제/아이디어를 바탕으로
완성도 높은 영상 제작 계획을 세워주세요.

【 콘텐츠 정보 】

1. 멤버 이름:
2. 플랫폼 (YT Shorts / Reels / TikTok 등):
3. 영상 주제/아이디어:
4. 목표 길이 (30초 / 1분 / 3분 등):
5. 타겟 시청자:
6. 메인 메시지 (한 줄):
7. 시각 스타일 (예: 미니멀 / 극적 / 밝은 톤 등):
8. 특별 요청사항:

【 당신이 해야 할 일 】

1️⃣ [콘텐츠 구조 설계]
   - 오프닝 (3초) - Hook 무엇인가
   - 전개 (중간)
   - 클라이막스
   - 엔딩 + CTA

2️⃣ [장면별 시나리오]
   - 1~10초: [무엇을 보여줄까]
   - 11~20초: [감정 전환점]
   - 21~30초 (이상): [결말]
   - 각 장면마다 "카메라 각도" "음성/음악" 포함

3️⃣ [나레이션/자막]
   - 읽을 스크립트 (정확히)
   - 자막으로 들어갈 텍스트
   - 감정 톤 (느리게/빠르게/높음/낮음 등)

4️⃣ [썸네일 + 제목 전략]
   - YouTube 썸네일 텍스트
   - 제목 (CTR 높은 버전)
   - 설명란 첫 줄
   - 해시태그 5~10개

5️⃣ [상호작용 전략]
   - 첫 댓글 (공감 유도형 or 반전형)
   - 스토리 설문 3가지 (Instagram용)
   - 댓글 회신 템플릿

6️⃣ [성공 신호]
   - 이 영상이 잘되려면 뭘 보면 될까
   - 조회수 목표 (현실적)
   - 참여도 지표

【 응답 형식 】

---

🎬 **[당신의 제목] - 제작 가이드**

📐 **구조 설계**
[시간별 구성]

📝 **장면별 시나리오**
[장면 설명 + 카메라 각도 + 음성]

🗣 **나레이션 스크립트**
[그대로 읽을 텍스트]

📱 **제목 & 썸네일**
- 제목: [옵션 1 / 옵션 2 / 옵션 3]
- 썸네일 텍스트: [텍스트]
- 첫 줄 설명: [설명]
- 해시태그: [5~10개]

💬 **상호작용 설정**
- 첫 댓글: [템플릿]
- 설문 3가지: [설문]

✅ **성공 신호**
- 목표 조회수: [숫자]
- 체크포인트: [무엇을 보면 성공인지]

---`
    },
    {
        id: 3,
        icon: '💡',
        title: '콘텐츠 아이디어 생성 프롬프트',
        description: '멤버 맞춤형 콘텐츠 아이디어 5가지를 AI 프롬프트와 함께 제공합니다.',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 49000,
        memberPrice: 14900,
        nonMemberPrice: 19900,
        discount: 70,
        badge: null,
        fullPrompt: `【 SNS 스터디방 - 콘텐츠 아이디어 생성 프롬프트 】

당신은 SNS 크리에이터의 "아이디어 파트너"입니다.

이 멤버에게 딱 맞는 콘텐츠 아이디어를 5가지 제안하세요.

【 멤버 정보 】

1. 멤버 이름:
2. 현재 운영 플랫폼:
3. 팔로워 수:
4. 주요 콘텐츠 주제:
5. 지난달 가장 잘 나간 영상 (제목/주제):
6. 현재 타겟 시청자 (나이/직업/상황):
7. 이번주 올릴 수 있는 콘텐츠 개수:
8. 촬영 시간 여유:
9. 특이사항 (특정 주제는 피하고 싶다 등):

【 당신이 해야 할 일 】

각 아이디어마다:

1️⃣ [아이디어 제목]
   - 한 줄로 핵심

2️⃣ [왜 이 아이디어인가]
   - 멤버의 강점을 살린 이유
   - 시청자들이 반응할 이유
   - 이전 성공 콘텐츠와의 연결점

3️⃣ [구체적 구성]
   - 콘텐츠 길이
   - 주요 씬 3~4가지
   - 나레이션 톤

4️⃣ [예상 반응]
   - 조회수 예측 (왜인지 근거 포함)
   - 댓글 유도 포인트

5️⃣ [바로 쓸 프롬프트]
   - 이 아이디어로 영상 만들 때 쓸 AI 프롬프트

【 응답 형식 】

---

🎬 **[당신의 이름]을 위한 콘텐츠 아이디어 5가지**

**아이디어 #1: [제목]**
📝 왜 이 아이디어: [근거]
🎥 구성: [씬별 설명]
🎯 예상 반응: [수치 + 이유]
🤖 AI 프롬프트: [복사-붙여넣기 가능]

**아이디어 #2: [제목]**
[위와 동일 구조]

… (5가지)

---`
    },

    // 스타터 패키지
    {
        id: 10,
        icon: '📦',
        title: '스타터 패키지 (2종)',
        description: 'SNS 입문자를 위한 필수 프롬프트 2종 세트. 방향성 설계 + 아이디어 생성',
        packageType: PACKAGE_TYPES.STARTER,
        originalPrice: 98000,
        memberPrice: 24900,
        nonMemberPrice: 29900,
        discount: 75,
        badge: '🏷️ 입문자 추천',
        badgeColor: '#3b82f6',
        included: [1, 3], // 포함된 프롬프트 ID
        fullPrompt: `이 패키지에는 다음 프롬프트들이 포함되어 있습니다:

1️⃣ SNS 방향성 설계 프롬프트
2️⃣ 콘텐츠 아이디어 생성 프롬프트

각 프롬프트는 개별 구매 시보다 75% 저렴한 가격입니다!`
    },
    // 프로 패키지 (BEST)
    {
        id: 11,
        icon: '🚀',
        title: '프로 패키지 (전체 3종)',
        description: 'SNS 성장을 위한 완벽한 올인원 패키지! 모든 프롬프트 + 보너스 + 평생 업데이트',
        packageType: PACKAGE_TYPES.PRO,
        originalPrice: 147000,
        memberPrice: 39900,
        nonMemberPrice: 49900,
        discount: 73,
        badge: '🔥 BEST',
        badgeColor: '#ef4444',
        isBest: true,
        included: [1, 2, 3],
        bonusItems: [
            '📄 프롬프트 활용 가이드 PDF',
            '📧 30일 이메일 코칭',
            '🔄 평생 무료 업데이트',
            '💎 신규 프롬프트 우선 제공'
        ],
        fullPrompt: `【 프로 패키지 올인원 】

✨ 포함된 프롬프트 (총 3종)
1️⃣ SNS 방향성 설계 프롬프트 (올인원) ⭐ 통합 업그레이드 버전!
   - 타인 분석 + 셀프 진단 모두 가능
   - 12주 로드맵 + 심리 코칭 + AI 활용 전략
   
2️⃣ 콘텐츠 제작 실행 프롬프트
   - 완성도 높은 영상 제작 계획
   - 시나리오, 썸네일까지 한번에
   
3️⃣ 콘텐츠 아이디어 생성 프롬프트
   - 30일치 콘텐츠 아이디어 자동 생성
   - 트렌드 분석 + 바이럴 전략

🎁 특별 보너스
• 프롬프트 활용 가이드 PDF (29,000원 가치)
• 30일 이메일 코칭 (150,000원 가치)
• 평생 무료 업데이트 (무제한 가치)
• 신규 프롬프트 우선 제공

💰 총 가치: 326,000원
오늘만: 39,900원 (87% 할인)

각 프롬프트를 개별적으로 확인하시려면 해당 프롬프트를 클릭해주세요.`
    },
    // 월간 구독
    {
        id: 12,
        icon: '⭐',
        title: '월간 크리에이터 클럽',
        description: '매주 새로운 프롬프트 + 커뮤니티 액세스 + 월 2회 라이브 Q&A',
        packageType: PACKAGE_TYPES.SUBSCRIPTION,
        originalPrice: 19900,
        memberPrice: 9900,
        nonMemberPrice: 12900,
        discount: 50,
        badge: '🔄 구독',
        badgeColor: '#8b5cf6',
        isSubscription: true,
        subscriptionBenefits: [
            '📚 전체 프롬프트 무제한 사용',
            '🆕 매주 신규 프롬프트 1개 추가',
            '👥 회원 전용 커뮤니티 (슬랙/디스코드)',
            '🎥 월 2회 라이브 Q&A 세션',
            '💬 성공 사례 공유 + 피드백',
            '🎯 취소 언제든지 가능'
        ],
        fullPrompt: `【 월간 크리에이터 클럽 구독 】

📅 매월 제공되는 혜택:

✅ 전체 프롬프트 라이브러리 무제한 액세스
✅ 매주 새로운 프롬프트 1개씩 추가 (주제 투표 가능)
✅ 회원 전용 커뮤니티 참여 (슬랙 or 디스코드)
✅ 월 2회 라이브 Q&A 세션 (줌)
✅ 성공 사례 공유 및 1:1 피드백
✅ 언제든지 취소 가능 (위약금 없음)

💰 가격: 월 9,900원 (회원가)
💎 연간 결제 시: 99,000원 (2개월 무료!)

🎁 첫 달 특별 혜택:
• 프로 패키지 모든 프롬프트 즉시 제공
• 환영 온보딩 세션 (1:1)
• 특별 보너스 프롬프트 3종

구독 시작 후 7일 내 만족하지 않으시면 100% 환불해드립니다.`
    }
];

// 상태 관리
let isMember = true; // 기본값: 회원

// DOM 요소
const memberSwitch = document.getElementById('memberSwitch');
const currentPrice = document.getElementById('currentPrice');
const promptGrid = document.getElementById('promptGrid');
const promptModal = document.getElementById('promptModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const promptCode = document.getElementById('promptCode');
const copyBtn = document.getElementById('copyBtn');
const purchaseBtn = document.getElementById('purchaseBtn');
const freeDiagnosisBtn = document.getElementById('freeDiagnosisBtn');

// 초기화
function init() {
    renderPrompts();
    updatePricing();
    setupEventListeners();
}

// 가격 업데이트
function updatePricing() {
    const price = isMember ? '₩10,000' : '₩20,000';
    currentPrice.textContent = price;
}

// 프롬프트 카드 렌더링
function renderPrompts() {
    promptGrid.innerHTML = '';
    
    promptsDatabase.forEach(prompt => {
        const price = isMember ? prompt.memberPrice : prompt.nonMemberPrice;
        const originalPrice = prompt.originalPrice;
        const priceFormatted = prompt.isFree ? '무료' : `₩${price.toLocaleString()}`;
        const priceLabel = prompt.isFree ? '🎁 완전 무료' : (isMember ? '회원가' : '일반가');
        
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        // 카드 스타일링
        if (prompt.isFree) {
            card.classList.add('free-card');
        } else if (prompt.isBest) {
            card.classList.add('best-card');
        } else if (prompt.isSubscription) {
            card.classList.add('subscription-card');
        }
        
        // 뱃지 HTML
        let badgeHtml = '';
        if (prompt.isFree) {
            // 무료 프롬프트에는 로그인 필요 배지
            const isLoggedIn = AuthManager && typeof AuthManager.isLoggedIn === 'function' && AuthManager.isLoggedIn();
            if (isLoggedIn) {
                badgeHtml = `<div class="card-badge" style="background: #10b981">${prompt.badge || '🎁 무료'}</div>`;
            } else {
                badgeHtml = `<div class="card-badge" style="background: #2563eb">🔐 로그인 필요</div>`;
            }
        } else if (prompt.badge) {
            badgeHtml = `<div class="card-badge" style="background: ${prompt.badgeColor || '#6b7280'}">${prompt.badge}</div>`;
        }
        
        // 할인율 표시
        const discountHtml = prompt.discount && !prompt.isFree ? `
            <div class="discount-badge">
                ${prompt.discount}% 할인
            </div>
        ` : '';
        
        // 원가 표시
        const originalPriceHtml = originalPrice > 0 && !prompt.isFree ? `
            <div class="original-price">₩${originalPrice.toLocaleString()}</div>
        ` : '';
        
        // 구독 표시
        const subscriptionLabel = prompt.isSubscription ? '<span class="subscription-label">/월</span>' : '';
        
        card.innerHTML = `
            ${badgeHtml}
            ${discountHtml}
            <div class="prompt-icon">${prompt.icon}</div>
            <h3 class="prompt-title">${prompt.title}</h3>
            <p class="prompt-description">${prompt.description}</p>
            <div class="prompt-price">
                <div class="price-info">
                    ${originalPriceHtml}
                    <div class="current-price">
                        <span class="price-label">${priceLabel}</span>
                        <span class="price-amount">${priceFormatted}${subscriptionLabel}</span>
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(prompt));
        promptGrid.appendChild(card);
    });
}

// 모달 열기
function openModal(prompt) {
    // 무료 프롬프트는 로그인 필수
    if (prompt.isFree && (!AuthManager || typeof AuthManager.isLoggedIn !== 'function' || !AuthManager.isLoggedIn())) {
        // 알림 없이 바로 로그인 페이지로 이동
        window.location.href = '/login.html';
        return;
    }
    
    const price = isMember ? prompt.memberPrice : prompt.nonMemberPrice;
    const originalPrice = prompt.originalPrice;
    
    // 가격 표시 포맷
    let priceHtml = '';
    if (prompt.isFree) {
        priceHtml = '🎁 완전 무료';
    } else {
        const priceLabel = isMember ? '회원가' : '일반가';
        const subscriptionLabel = prompt.isSubscription ? '/월' : '';
        
        if (originalPrice > 0) {
            priceHtml = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="text-decoration: line-through; color: #9ca3af; font-size: 1.25rem;">
                        ₩${originalPrice.toLocaleString()}
                    </span>
                    <span style="background: #ef4444; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; font-weight: 700;">
                        ${prompt.discount}% 할인
                    </span>
                </div>
                <div style="margin-top: 0.5rem;">
                    ${priceLabel}: <strong>₩${price.toLocaleString()}${subscriptionLabel}</strong>
                </div>
            `;
        } else {
            priceHtml = `${priceLabel}: ₩${price.toLocaleString()}${subscriptionLabel}`;
        }
    }
    
    modalTitle.textContent = prompt.title;
    modalPrice.innerHTML = priceHtml;
    modalDescription.textContent = prompt.description;
    
    // 구매 여부 확인 (무료 프롬프트 또는 구매한 프롬프트)
    const hasPurchased = prompt.isFree || checkIfPurchased(prompt.id);
    
    if (hasPurchased) {
        // 구매했거나 무료: 전체 프롬프트 표시
        promptCode.textContent = prompt.fullPrompt;
        promptCode.classList.remove('blurred');
        copyBtn.disabled = false;
        copyBtn.style.display = 'flex';
        
        if (prompt.isFree) {
            purchaseBtn.style.display = 'none';
        } else {
            purchaseBtn.style.display = 'none';
        }
    } else {
        // 미구매: 일부만 미리보기 + 흐림 효과
        const previewLength = 150; // 150자만 미리보기
        const preview = prompt.fullPrompt.substring(0, previewLength) + '\n\n[... 이하 생략 ...]\n\n━━━━━━━━━━━━━━━━━━━━\n\n💡 이 프롬프트는 실제로 ' + prompt.fullPrompt.length + '자의 상세한 내용을 포함하고 있습니다.\n\n✨ 곧 구매 가능합니다! 조금만 기다려주세요 😊';
        promptCode.textContent = preview;
        promptCode.classList.add('blurred');
        copyBtn.disabled = true;
        copyBtn.style.display = 'flex';
        copyBtn.textContent = '🔒 구매 후 복사 가능';
        
        // 결제 시스템 준비중 - 버튼 비활성화
        purchaseBtn.style.display = 'block';
        purchaseBtn.textContent = '🔧 결제 시스템 준비중';
        purchaseBtn.disabled = true;
        purchaseBtn.style.opacity = '0.6';
        purchaseBtn.style.cursor = 'not-allowed';
        purchaseBtn.setAttribute('data-prompt-id', prompt.id);
    }
    
    promptModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 구매 여부 확인 함수
function checkIfPurchased(promptId) {
    // 로그인하지 않았으면 구매 불가
    if (!AuthManager || typeof AuthManager.isLoggedIn !== 'function' || !AuthManager.isLoggedIn()) {
        return false;
    }
    
    // 로컬 스토리지에서 구매 목록 확인
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    return purchases.some(p => p.prompt_id === promptId);
}

// 모달 닫기
function closeModal() {
    promptModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 프롬프트 복사
function copyPrompt() {
    // 비활성화 상태면 복사 불가
    if (copyBtn.disabled) {
        alert('🔒 프롬프트를 복사하려면 먼저 구매해주세요!');
        return;
    }
    
    const text = promptCode.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="copy-icon">✅</span><span class="copy-text">복사 완료!</span>';
        
        setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">복사하기</span>';
        }, 2000);
    }).catch(err => {
        alert('복사에 실패했습니다. 다시 시도해주세요.');
        console.error('복사 실패:', err);
    });
}

// 구매 처리
function handlePurchase() {
    // 결제 시스템 준비중 메시지
    alert('🔧 결제 시스템 준비중입니다\n\n현재 사업자 등록 및 PG사 계약 진행 중입니다.\n곧 이용 가능하니 조금만 기다려주세요! 😊\n\n📧 문의: eager1014@gmail.com');
    return;
    
    /* 결제 시스템 준비 완료 후 활성화할 코드
    const promptTitle = modalTitle.textContent;
    const priceText = modalPrice.textContent;
    
    // 현재 열린 프롬프트 ID 찾기
    const currentPrompt = promptsDatabase.find(p => p.title === promptTitle);
    if (!currentPrompt) {
        alert('❌ 프롬프트 정보를 찾을 수 없습니다.');
        return;
    }
    
    const price = isMember ? currentPrompt.memberPrice : currentPrompt.nonMemberPrice;
    
    // auth.js의 purchasePrompt 함수 호출
    if (typeof purchasePrompt === 'function') {
        purchasePrompt(currentPrompt.id, promptTitle, price);
    } else {
        alert('⚠️ 구매 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
    */
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 회원/비회원 토글
    memberSwitch.addEventListener('change', (e) => {
        isMember = !e.target.checked;
        updatePricing();
        renderPrompts();
    });
    
    // 무료 진단 버튼
    freeDiagnosisBtn.addEventListener('click', () => {
        // 로그인 확인
        if (!AuthManager || typeof AuthManager.isLoggedIn !== 'function' || !AuthManager.isLoggedIn()) {
            // 알림 없이 바로 로그인 페이지로 이동
            window.location.href = '/login.html';
            return;
        }
        
        const freePrompt = promptsDatabase.find(p => p.isFree);
        if (freePrompt) {
            openModal(freePrompt);
        }
    });
    
    // 모달 닫기
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && promptModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 복사 버튼
    copyBtn.addEventListener('click', copyPrompt);
    
    // 구매 버튼
    purchaseBtn.addEventListener('click', handlePurchase);
}

// 카운트다운 타이머
function startCountdown() {
    const countdownElements = [
        document.getElementById('countdown'),
        document.getElementById('catalogCountdown')
    ];
    
    // 24시간 카운트다운 (임의로 23:45:12부터 시작)
    let hours = 23;
    let minutes = 45;
    let seconds = 12;
    
    setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            hours = 23;
            minutes = 59;
            seconds = 59;
        }
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        countdownElements.forEach(el => {
            if (el) el.textContent = timeString;
        });
    }, 1000);
}

// 사용자 수 증가 애니메이션
function animateUserCount() {
    const userCountEl = document.getElementById('userCount');
    if (!userCountEl) return;
    
    let count = 1247;
    
    // 10-30초마다 1-3명씩 증가
    setInterval(() => {
        const increment = Math.floor(Math.random() * 3) + 1;
        count += increment;
        
        userCountEl.style.transform = 'scale(1.2)';
        userCountEl.style.color = '#10b981';
        userCountEl.textContent = count.toLocaleString();
        
        setTimeout(() => {
            userCountEl.style.transform = 'scale(1)';
            userCountEl.style.color = '';
        }, 300);
    }, Math.random() * 20000 + 10000);
}

// 3시간 할인 배너 체크 및 표시
async function checkWelcomeDiscount() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
        const response = await fetch('/api/user/discount', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // 회원이면서 3시간 이내인 경우 배너 표시
            if (data.is_member && data.is_welcome_period && data.remaining_minutes > 0) {
                const banner = document.getElementById('welcomeBanner');
                const timeSpan = document.getElementById('remainingTime');
                
                if (banner && timeSpan) {
                    const hours = Math.floor(data.remaining_minutes / 60);
                    const minutes = data.remaining_minutes % 60;
                    
                    if (hours > 0) {
                        timeSpan.textContent = `${hours}시간 ${minutes}분`;
                    } else {
                        timeSpan.textContent = `${minutes}분`;
                    }
                    
                    banner.style.display = 'block';
                    
                    // 1분마다 업데이트
                    setInterval(() => {
                        checkWelcomeDiscount();
                    }, 60000);
                }
            }
        }
    } catch (error) {
        console.log('할인 정보 조회 실패:', error);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    init();
    startCountdown();
    animateUserCount();
    checkWelcomeDiscount(); // 3시간 할인 체크
});
