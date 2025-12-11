// 소모임 자동 가입 시스템

// URL에서 소모임 referral 파라미터 체크
function checkSomoimReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const source = urlParams.get('source');
    
    // 소모임에서 왔는지 체크
    if (ref === 'somoim' || source === 'somoim' || document.referrer.includes('somoim.co.kr')) {
        // 이미 로그인되어 있으면 스킵
        const token = localStorage.getItem('auth_token');
        if (token) {
            return;
        }
        
        // 소모임 자동 가입 진행
        handleSomoimAutoRegister();
    }
}

// 소모임 자동 가입 처리
async function handleSomoimAutoRegister() {
    try {
        const response = await fetch('/api/somoim-auto-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                somoim_id: '8cafe332-cbff-11ef-b613-0a50aa12fbb11'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 토큰 저장
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_info', JSON.stringify(data.user));
            
            // 환영 메시지
            showSomoimWelcomeModal(data);
        }
    } catch (error) {
        console.error('소모임 자동 가입 실패:', error);
    }
}

// 소모임 환영 모달
function showSomoimWelcomeModal(data) {
    const isNewUser = data.temp_credentials ? true : false;
    
    const modalHTML = `
        <div class="auth-modal" id="somoimWelcomeModal" style="z-index: 10000;">
            <div class="auth-modal-overlay" onclick="closeSomoimModal()"></div>
            <div class="auth-modal-content" style="max-width: 500px;">
                <button class="auth-modal-close" onclick="closeSomoimModal()">&times;</button>
                <h2 class="auth-modal-title">🎉 소모임 환영합니다!</h2>
                <p class="auth-modal-subtitle">${data.message}</p>
                
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">✨ 소모임 회원 혜택</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>🎁 즉시 회원 할인 적용 (30% OFF)</li>
                        <li>⚡ 가입 후 3시간 추가 50% 할인</li>
                        <li>🚀 모든 프롬프트 특별가</li>
                        <li>💎 커뮤니티 우선 접근</li>
                    </ul>
                </div>
                
                ${isNewUser ? `
                <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <p style="color: #1e40af; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>📝 임시 계정이 생성되었습니다</strong>
                    </p>
                    <p style="color: #1e40af; font-size: 0.875rem; margin: 0;">
                        나중에 <strong>회원정보 수정</strong>에서 이메일과 비밀번호를 변경하실 수 있습니다.
                    </p>
                </div>
                ` : ''}
                
                <button onclick="closeSomoimModal()" class="auth-submit-btn" style="width: 100%; margin-top: 1rem;">
                    시작하기 🚀
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeSomoimModal() {
    const modal = document.getElementById('somoimWelcomeModal');
    if (modal) {
        modal.remove();
    }
    // 페이지 새로고침하여 로그인 상태 반영
    window.location.reload();
}

// 페이지 로드 시 자동 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSomoimReferral);
} else {
    checkSomoimReferral();
}
