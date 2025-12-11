// ==================== 인증 관리 ====================

const API_BASE_URL = window.location.origin;

// 토큰 저장/조회/삭제
const AuthManager = {
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },
    
    getToken() {
        return localStorage.getItem('auth_token');
    },
    
    removeToken() {
        localStorage.removeItem('auth_token');
    },
    
    setUser(user) {
        localStorage.setItem('user_info', JSON.stringify(user));
    },
    
    getUser() {
        const userStr = localStorage.getItem('user_info');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    removeUser() {
        localStorage.removeItem('user_info');
    },
    
    isLoggedIn() {
        return !!this.getToken();
    },
    
    logout() {
        this.removeToken();
        this.removeUser();
        location.reload();
    }
};

// API 요청 헬퍼
async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const token = AuthManager.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '요청 실패');
        }
        
        return data;
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
}

// ==================== 회원가입 ====================

function showRegisterModal() {
    const modalHTML = `
        <div class="auth-modal" id="registerModal">
            <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
            <div class="auth-modal-content">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title">🎉 회원가입</h2>
                <p class="auth-modal-subtitle">회원가입하고 50% 할인받으세요!</p>
                
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label>이름</label>
                        <input type="text" name="username" placeholder="홍길동" required>
                    </div>
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" placeholder="8자 이상" minlength="8" required>
                    </div>
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="is_member" checked>
                            <span>회원으로 가입 (50% 할인)</span>
                        </label>
                    </div>
                    <button type="submit" class="auth-submit-btn">가입하기</button>
                </form>
                
                <p class="auth-switch">
                    이미 계정이 있으신가요? 
                    <a href="#" onclick="showLoginModal(); return false;">로그인</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        is_member: formData.get('is_member') === 'on'
    };
    
    try {
        const response = await apiRequest('/api/register', 'POST', data);
        
        AuthManager.setToken(response.token);
        AuthManager.setUser(response.user);
        
        alert('✅ ' + response.message);
        closeAuthModal();
        updateUIForLoggedInUser(response.user);
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==================== 로그인 ====================

function showLoginModal() {
    const modalHTML = `
        <div class="auth-modal" id="loginModal">
            <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
            <div class="auth-modal-content">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title">👋 로그인</h2>
                <p class="auth-modal-subtitle">찐부부 AI 프롬프트에 오신 것을 환영합니다!</p>
                
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" placeholder="비밀번호" required>
                    </div>
                    <button type="submit" class="auth-submit-btn">로그인</button>
                </form>
                
                <p class="auth-switch">
                    아직 계정이 없으신가요? 
                    <a href="#" onclick="showRegisterModal(); return false;">회원가입</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await apiRequest('/api/login', 'POST', data);
        
        AuthManager.setToken(response.token);
        AuthManager.setUser(response.user);
        
        alert('✅ ' + response.message);
        closeAuthModal();
        updateUIForLoggedInUser(response.user);
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==================== UI 업데이트 ====================

function closeAuthModal() {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => modal.remove());
}

function updateUIForLoggedInUser(user) {
    // 헤더에 사용자 정보 표시
    const nav = document.querySelector('.nav');
    if (nav) {
        const memberToggle = nav.querySelector('.membership-toggle');
        if (memberToggle) {
            memberToggle.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">👋 ${user.username}님</span>
                    <button class="user-btn" onclick="showUserDashboard()">내 정보</button>
                    <button class="user-btn logout" onclick="AuthManager.logout()">로그아웃</button>
                </div>
            `;
        }
    }
    
    // 회원/비회원 가격 자동 설정
    if (user.is_member) {
        isMember = true;
        document.getElementById('memberSwitch').checked = false;
    } else {
        isMember = false;
        document.getElementById('memberSwitch').checked = true;
    }
    
    updatePrices();
}

// ==================== 사용자 대시보드 ====================

async function showUserDashboard() {
    try {
        const data = await apiRequest('/api/user/me', 'GET');
        
        const modalHTML = `
            <div class="auth-modal" id="dashboardModal">
                <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
                <div class="auth-modal-content dashboard">
                    <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                    <h2 class="auth-modal-title">📊 내 대시보드</h2>
                    
                    <div class="user-info-card">
                        <h3>👤 사용자 정보</h3>
                        <p><strong>이름:</strong> ${data.user.username}</p>
                        <p><strong>이메일:</strong> ${data.user.email}</p>
                        <p><strong>멤버십:</strong> ${data.user.is_member ? '✅ 회원 (50% 할인)' : '❌ 비회원'}</p>
                        <p><strong>가입일:</strong> ${new Date(data.user.created_at).toLocaleDateString('ko-KR')}</p>
                    </div>
                    
                    <div class="purchases-card">
                        <h3>🛍️ 구매 내역 (${data.purchases.length}개)</h3>
                        ${data.purchases.length > 0 ? `
                            <div class="purchases-list">
                                ${data.purchases.map(p => `
                                    <div class="purchase-item">
                                        <div class="purchase-info">
                                            <strong>${p.prompt_title}</strong>
                                            <span class="purchase-date">${new Date(p.purchased_at).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                        <div class="purchase-price">₩${p.price.toLocaleString()}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="no-purchases">아직 구매한 프롬프트가 없습니다.</p>'}
                    </div>
                    
                    <div class="dashboard-stats">
                        <div class="stat-box">
                            <div class="stat-number">${data.purchases.length}</div>
                            <div class="stat-label">구매한 프롬프트</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">₩${data.purchases.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</div>
                            <div class="stat-label">총 결제 금액</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        alert('❌ 대시보드를 불러올 수 없습니다: ' + error.message);
    }
}

// ==================== 프롬프트 구매 ====================

async function purchasePrompt(promptId, promptTitle, price) {
    if (!AuthManager.isLoggedIn()) {
        alert('⚠️ 로그인이 필요합니다!');
        showLoginModal();
        return;
    }
    
    if (!confirm(`"${promptTitle}"을(를) ₩${price.toLocaleString()}에 구매하시겠습니까?`)) {
        return;
    }
    
    try {
        const response = await apiRequest('/api/purchase', 'POST', {
            prompt_id: promptId,
            prompt_title: promptTitle,
            price: price
        });
        
        alert('✅ ' + response.message);
        
        // 모달 닫기
        document.getElementById('modalClose').click();
        
        // 대시보드 표시
        showUserDashboard();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==================== 페이지 로드 시 초기화 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    const user = AuthManager.getUser();
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        // 로그인/회원가입 버튼 추가
        const nav = document.querySelector('.nav');
        if (nav) {
            const memberToggle = nav.querySelector('.membership-toggle');
            if (memberToggle) {
                const authButtons = document.createElement('div');
                authButtons.className = 'auth-buttons';
                authButtons.innerHTML = `
                    <button class="auth-btn login-btn" onclick="showLoginModal()">로그인</button>
                    <button class="auth-btn register-btn" onclick="showRegisterModal()">회원가입</button>
                `;
                memberToggle.parentNode.insertBefore(authButtons, memberToggle);
            }
        }
    }
});
