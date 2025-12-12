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
    // 1. AI 활용 능력 진단 (무료)
    {
        id: 0,
        icon: '🆓',
        title: 'AI 활용 능력 진단',
        description: '나는 ChatGPT를 얼마나 잘 쓰고 있을까? 상위 몇 %인지 AI가 분석해드립니다',
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

【 핵심 구성 】
✅ 4가지 기준 점수 측정 (프롬프트 작성/창의적 활용/반복 최적화/비즈니스 연결)
✅ 상위 백분위 진단 + 근거
✅ 즉시 개선 포인트 3가지
✅ 1주/1개월/3개월 로드맵 제공

【 핵심 기능 】
1. 정확한 수치화 진단
2. 구체적인 개선 방법
3. 바로 실행 가능한 액션 플랜
4. 단계별 실전 프롬프트 제공

【 추천 대상 】
- ChatGPT 처음 배우는 초보자
- 내 수준을 객관적으로 알고 싶은 분
- 더 효율적으로 AI 쓰고 싶은 직장인
- AI 활용 능력 자가진단하고 싶은 크리에이터

[전체 프롬프트 내용은 로그인 후 확인 가능]`
    },
    
    // 2. 감정 스토리텔링 생성기
    {
        id: 1,
        icon: '💬',
        title: '감정 스토리텔링 생성기',
        description: '감정을 움직이는 스토리를 AI가 자동 생성. 공감 100% 콘텐츠 완성',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 49000,
        memberPrice: 9900,
        nonMemberPrice: 14900,
        discount: 80,
        badge: '🔥 인기',
        badgeColor: '#ef4444',
        fullPrompt: `【 감정 스토리텔링 생성기 프롬프트 】

당신은 "감정 마케팅 전문 카피라이터"입니다.

사람들의 마음을 움직이는 스토리를 만들어주세요.

【 핵심 구성 】
✅ 타겟 감정 (공감/설렘/분노/희망 등) 선택
✅ 스토리 라인 3가지 자동 생성
✅ 각 스토리별 최적 플랫폼 추천
✅ 썸네일/제목/해시태그 세트 제공

【 핵심 기능 】
1. 특정 감정 자극하는 스토리 생성
2. 타겟 페르소나 맞춤형 전개
3. 플랫폼별 최적화 (인스타/유튜브/블로그)
4. 바이럴 요소 자동 삽입

【 추천 대상 】
- 공감 콘텐츠 만들고 싶은 크리에이터
- 감성 마케팅 필요한 브랜드
- SNS 반응 높이고 싶은 마케터
- 스토리텔링 배우고 싶은 초보자

[전체 프롬프트 내용은 구매 후 확인 가능]`
    },
    
    // 3. 인스타 릴스 자동 생성기
    {
        id: 2,
        icon: '📱',
        title: '인스타 릴스 자동 생성기',
        description: '15초, 30초, 60초 릴스 대본부터 편집 가이드까지 AI가 한번에',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 59000,
        memberPrice: 12900,
        nonMemberPrice: 17900,
        discount: 78,
        badge: '🎬 신규',
        badgeColor: '#8b5cf6',
        fullPrompt: `【 인스타 릴스 자동 생성기 프롬프트 】

당신은 "인스타그램 릴스 전문 크리에이터"입니다.

바이럴 되는 릴스 콘텐츠를 설계해주세요.

【 핵심 구성 】
✅ 15초/30초/60초 길이별 대본 생성
✅ 장면별 구성 (오프닝/전개/클라이막스/CTA)
✅ BGM 추천 + 편집 타이밍
✅ 자막 텍스트 + 이모지 배치

【 핵심 기능 】
1. 시간대별 스크립트 자동 생성
2. 트렌디한 사운드 매칭
3. 알고리즘 최적화 해시태그 10개
4. 첫 3초 훅(Hook) 강화 전략

【 추천 대상 】
- 인스타 릴스 시작하는 초보자
- 조회수 높이고 싶은 크리에이터
- 숏폼 콘텐츠 양산하고 싶은 마케터
- 편집 시간 줄이고 싶은 1인 기업

[전체 프롬프트 내용은 구매 후 확인 가능]`
    },
    
    // 4. 유튜브 제목/썸네일 완성 프롬프트
    {
        id: 3,
        icon: '🎬',
        title: '유튜브 제목/썸네일 완성 프롬프트',
        description: 'CTR 10% 이상 썸네일 텍스트와 클릭 유도 제목 자동 생성',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 39000,
        memberPrice: 7900,
        nonMemberPrice: 12900,
        discount: 80,
        badge: '👍 베스트',
        badgeColor: '#f59e0b',
        fullPrompt: `【 유튜브 제목/썸네일 완성 프롬프트 】

당신은 "유튜브 알고리즘 최적화 전문가"입니다.

클릭률(CTR)을 높이는 제목과 썸네일을 설계해주세요.

【 핵심 구성 】
✅ 제목 후보 10개 생성 (CTR 예측 포함)
✅ 썸네일 텍스트 3가지 버전
✅ 색상 조합 + 레이아웃 추천
✅ A/B 테스트 전략

【 핵심 기능 】
1. 키워드 최적화 제목
2. 감정 자극 포인트 삽입
3. 썸네일 텍스트 가독성 검증
4. 경쟁 영상 분석 기반 차별화

【 추천 대상 】
- 조회수 정체된 유튜버
- 썸네일 디자인 고민하는 크리에이터
- 제목 짓기 어려운 브이로거
- CTR 개선하고 싶은 채널 운영자

[전체 프롬프트 내용은 구매 후 확인 가능]`
    },
    
    // 5. 브랜드 빌더 3.0
    {
        id: 4,
        icon: '🏷️',
        title: '브랜드 빌더 3.0',
        description: '나만의 브랜드 아이덴티티를 AI가 설계. 로고부터 슬로건까지',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 99000,
        memberPrice: 19900,
        nonMemberPrice: 29900,
        discount: 80,
        badge: '✨ 프리미엄',
        badgeColor: '#2563eb',
        fullPrompt: `【 브랜드 빌더 3.0 프롬프트 】

당신은 "브랜드 아이덴티티 디자이너"입니다.

개인 또는 비즈니스 브랜드를 완성해주세요.

【 핵심 구성 】
✅ 브랜드 네임 후보 20개 + 이유
✅ 슬로건/캐치프레이즈 10개
✅ 컬러 팔레트 + 폰트 추천
✅ 브랜드 스토리 3가지 버전

【 핵심 기능 】
1. 타겟 고객 페르소나 기반 브랜딩
2. 경쟁사 차별화 포인트 발굴
3. 감성/이성 브랜딩 밸런스
4. SNS 프로필 최적화 가이드

【 추천 대상 】
- 1인 브랜드 만들고 싶은 크리에이터
- 브랜딩 고민하는 소상공인
- 리브랜딩 필요한 기업
- 브랜드 정체성 찾고 싶은 마케터

[전체 프롬프트 내용은 구매 후 확인 가능]`
    },
    
    // 6. 자동 리뷰&답변 프롬프트
    {
        id: 5,
        icon: '⭐',
        title: '자동 리뷰&답변 프롬프트',
        description: '고객 리뷰에 AI가 자동 답변. 감사/사과/해결 톤 맞춤 생성',
        packageType: PACKAGE_TYPES.SINGLE,
        originalPrice: 29000,
        memberPrice: 5900,
        nonMemberPrice: 9900,
        discount: 80,
        badge: '💬 필수',
        badgeColor: '#10b981',
        fullPrompt: `【 자동 리뷰&답변 프롬프트 】

당신은 "고객 응대 전문 매니저"입니다.

리뷰에 맞춤형 답변을 작성해주세요.

【 핵심 구성 】
✅ 긍정/부정/중립 리뷰 자동 분류
✅ 톤앤매너 선택 (친근함/공식적/유머)
✅ 답변 템플릿 3가지 버전 생성
✅ 추가 혜택 제안 (쿠폰/이벤트 연결)

【 핵심 기능 】
1. 리뷰 감정 분석
2. 브랜드 톤에 맞는 답변
3. 불만 고객 전환 전략
4. 긍정 리뷰 바이럴 활용법

【 추천 대상 】
- 온라인 쇼핑몰 운영자
- 리뷰 답변 시간 줄이고 싶은 사장님
- 고객 응대 개선하고 싶은 CS팀
- 브랜드 이미지 관리하는 마케터

[전체 프롬프트 내용은 구매 후 확인 가능]`
    },
    
    // 7. SNS 통합 마스터 패키지
    {
        id: 6,
        icon: '🎯',
        title: 'SNS 통합 마스터 패키지',
        description: '인스타+유튜브+블로그 콘텐츠를 한번에! 6개 프롬프트 세트',
        packageType: PACKAGE_TYPES.STARTER,
        originalPrice: 250000,
        memberPrice: 49900,
        nonMemberPrice: 69900,
        discount: 80,
        badge: '🔥 패키지',
        badgeColor: '#ef4444',
        included: [1, 2, 3, 4, 5, 0],
        fullPrompt: `【 SNS 통합 마스터 패키지 】

✨ 포함 프롬프트 (총 6종)

1️⃣ 감정 스토리텔링 생성기
2️⃣ 인스타 릴스 자동 생성기
3️⃣ 유튜브 제목/썸네일 완성 프롬프트
4️⃣ 브랜드 빌더 3.0
5️⃣ 자동 리뷰&답변 프롬프트
🎁 AI 활용 능력 진단 (무료 포함!)

【 패키지 혜택 】
✅ 개별 구매 대비 80% 할인
✅ 평생 무료 업데이트
✅ 프롬프트 활용 가이드 PDF
✅ 이메일 Q&A 지원 (30일)

💰 총 가치: 274,000원
오늘만: 49,900원

각 프롬프트를 개별적으로 확인하시려면 해당 프롬프트를 클릭해주세요.`
    },
    
    // 8. 숏폼 영상 올인원 세트
    {
        id: 7,
        icon: '📹',
        title: '숏폼 영상 올인원 세트',
        description: '릴스+쇼츠+틱톡 대본부터 편집까지! 숏폼 전문 3종 세트',
        packageType: PACKAGE_TYPES.STARTER,
        originalPrice: 150000,
        memberPrice: 29900,
        nonMemberPrice: 39900,
        discount: 80,
        badge: '🎬 인기',
        badgeColor: '#8b5cf6',
        included: [1, 2, 3],
        fullPrompt: `【 숏폼 영상 올인원 세트 】

✨ 포함 프롬프트 (총 3종)

1️⃣ 감정 스토리텔링 생성기
   - 공감 유발 스토리 자동 생성
   
2️⃣ 인스타 릴스 자동 생성기
   - 15/30/60초 릴스 대본 완성
   
3️⃣ 유튜브 제목/썸네일 완성 프롬프트
   - CTR 10% 이상 제목/썸네일

【 패키지 혜택 】
✅ 숏폼 콘텐츠 제작 완벽 대응
✅ 플랫폼별 최적화 전략
✅ 바이럴 공식 적용
✅ 편집 시간 90% 단축

💰 총 가치: 147,000원
오늘만: 29,900원

각 프롬프트를 개별적으로 확인하시려면 해당 프롬프트를 클릭해주세요.`
    },
    
    // 9. 1인 브랜드 Pro 완성 패키지
    {
        id: 8,
        icon: '🚀',
        title: '1인 브랜드 Pro 완성 패키지',
        description: 'AI 진단부터 브랜딩, 콘텐츠까지! 1인 브랜드 성공 올인원',
        packageType: PACKAGE_TYPES.PRO,
        originalPrice: 400000,
        memberPrice: 79900,
        nonMemberPrice: 99900,
        discount: 80,
        badge: '👑 최고급',
        badgeColor: '#f59e0b',
        isBest: true,
        included: [0, 1, 2, 3, 4, 5],
        bonusItems: [
            '📄 1인 브랜드 구축 로드맵 PDF',
            '📧 60일 이메일 코칭',
            '🔄 평생 무료 업데이트',
            '💎 신규 프롬프트 우선 제공',
            '🎯 1:1 온라인 컨설팅 (1회)'
        ],
        fullPrompt: `【 1인 브랜드 Pro 완성 패키지 】

✨ 포함 프롬프트 (전체 6종)

🎁 AI 활용 능력 진단 (무료)
   - 나의 AI 활용 레벨 체크
   
1️⃣ 감정 스토리텔링 생성기
   - 공감 콘텐츠 자동 생성
   
2️⃣ 인스타 릴스 자동 생성기
   - 숏폼 대본 완벽 대응
   
3️⃣ 유튜브 제목/썸네일 완성 프롬프트
   - CTR 극대화
   
4️⃣ 브랜드 빌더 3.0
   - 브랜드 아이덴티티 완성
   
5️⃣ 자동 리뷰&답변 프롬프트
   - CS 자동화

🎁 특별 보너스
• 1인 브랜드 구축 로드맵 PDF (99,000원 가치)
• 60일 이메일 코칭 (300,000원 가치)
• 평생 무료 업데이트 (무제한 가치)
• 신규 프롬프트 우선 제공
• 1:1 온라인 컨설팅 1회 (200,000원 가치)

💰 총 가치: 873,000원
오늘만: 79,900원 (91% 할인!)

각 프롬프트를 개별적으로 확인하시려면 해당 프롬프트를 클릭해주세요.`
    },
    
    // 10. GPT 크리에이터 VIP 클럽
    {
        id: 9,
        icon: '💎',
        title: 'GPT 크리에이터 VIP 클럽',
        description: '월 4개 신규 프롬프트 + 커뮤니티 + 라이브 Q&A + 1:1 피드백',
        packageType: PACKAGE_TYPES.SUBSCRIPTION,
        originalPrice: 49900,
        memberPrice: 19900,
        nonMemberPrice: 29900,
        discount: 60,
        badge: '🔄 구독',
        badgeColor: '#2563eb',
        isSubscription: true,
        subscriptionBenefits: [
            '📚 전체 프롬프트 무제한 사용',
            '🆕 매주 신규 프롬프트 1개 추가',
            '👥 VIP 전용 커뮤니티 (슬랙)',
            '🎥 월 4회 라이브 Q&A 세션',
            '💬 1:1 프롬프트 피드백 (월 2회)',
            '🎯 성공 사례 공유 + 리뷰',
            '✨ 취소 언제든지 가능 (위약금 無)'
        ],
        fullPrompt: `【 GPT 크리에이터 VIP 클럽 구독 】

📅 매월 제공되는 혜택:

✅ 전체 프롬프트 라이브러리 무제한 액세스
✅ 매주 새로운 프롬프트 1개씩 추가 (주제 투표 가능)
✅ VIP 전용 커뮤니티 참여 (슬랙)
✅ 월 4회 라이브 Q&A 세션 (줌)
✅ 1:1 프롬프트 피드백 (월 2회)
✅ 성공 사례 공유 및 리뷰
✅ 언제든지 취소 가능 (위약금 없음)

💰 가격: 월 19,900원 (VIP 회원가)
💎 연간 결제 시: 199,000원 (2개월 무료!)

🎁 첫 달 특별 혜택:
• 1인 브랜드 Pro 패키지 모든 프롬프트 즉시 제공
• VIP 환영 온보딩 세션 (1:1 화상)
• 특별 보너스 프롬프트 5종
• GPT 활용 꿀팁 가이드북 PDF

구독 시작 후 14일 내 만족하지 않으시면 100% 환불해드립니다.

━━━━━━━━━━━━━━━━━━━━

💡 이런 분들께 추천합니다:
✅ 매달 새로운 프롬프트 필요한 크리에이터
✅ AI 활용 능력 지속적으로 업그레이드하고 싶은 분
✅ 커뮤니티에서 함께 성장하고 싶은 분
✅ 프롬프트 피드백 받으며 배우고 싶은 분`
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
    // 로그인 상태 확인
    const isLoggedIn = AuthManager && typeof AuthManager.isLoggedIn === 'function' && AuthManager.isLoggedIn();
    
    // 무료 프롬프트는 로그인 필수 (바로 로그인 모달)
    if (prompt.isFree && !isLoggedIn) {
        if (typeof showLoginModal === 'function') {
            showLoginModal();
        } else {
            alert('로그인이 필요합니다.');
        }
        return;
    }
    
    // 유료 프롬프트는 회원가입 안내
    if (!prompt.isFree && !isLoggedIn) {
        if (confirm('💎 회원가입이 필요합니다\n\n회원가입 후 다양한 혜택을 받아보세요!\n\n✨ 회원 전용 할인가\n🎁 무료 AI 진단 프롬프트\n📚 프리미엄 콘텐츠 접근\n\n지금 가입하시겠습니까?')) {
            if (typeof showRegisterModal === 'function') {
                showRegisterModal();
            } else {
                alert('회원가입 페이지로 이동할 수 없습니다.');
            }
        }
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
            // 로그인 모달 표시
            if (typeof showLoginModal === 'function') {
                showLoginModal();
            } else {
                alert('로그인이 필요합니다.');
            }
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
