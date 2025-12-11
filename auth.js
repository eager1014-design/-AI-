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
            <div class="auth-modal-content" style="max-width: 500px;">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title">🎉 회원가입</h2>
                <p class="auth-modal-subtitle">회원가입하고 50% 할인받으세요!</p>
                
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label>이름 *</label>
                        <input type="text" name="username" placeholder="홍길동" required>
                    </div>
                    <div class="form-group">
                        <label>이메일 *</label>
                        <input type="email" name="email" placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>전화번호 *</label>
                        <input type="tel" name="phone" placeholder="010-1234-5678" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}" required>
                        <small style="color: #6b7280; font-size: 0.875rem;">형식: 010-1234-5678</small>
                    </div>
                    <div class="form-group">
                        <label>생년월일 *</label>
                        <input type="date" name="birthdate" required max="${new Date().toISOString().split('T')[0]}">
                        <small style="color: #6b7280; font-size: 0.875rem;">만 14세 이상만 가입 가능합니다</small>
                    </div>
                    <div class="form-group">
                        <label>비밀번호 *</label>
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
    
    // 생년월일로 만 14세 이상 체크
    const birthdate = new Date(formData.get('birthdate'));
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (age < 14 || (age === 14 && monthDiff < 0)) {
        alert('⚠️ 만 14세 이상만 가입 가능합니다.');
        return;
    }
    
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate'),
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
        
        // 관리자인 경우 대시보드로 이동
        if (response.user.is_admin) {
            alert('👑 관리자로 로그인되었습니다. 관리자 대시보드로 이동합니다.');
            window.location.href = '/admin-dashboard.html';
            return;
        }
        
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
    // 관리자 버튼 표시/숨김
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn && user.is_admin) {
        adminBtn.style.display = 'flex';
    }
    
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
        const memberSwitch = document.getElementById('memberSwitch');
        if (memberSwitch) {
            memberSwitch.checked = false;
        }
    } else {
        isMember = false;
        const memberSwitch = document.getElementById('memberSwitch');
        if (memberSwitch) {
            memberSwitch.checked = true;
        }
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
                        <p><strong>전화번호:</strong> ${data.user.phone || '-'}</p>
                        <p><strong>생년월일:</strong> ${data.user.birthdate ? new Date(data.user.birthdate).toLocaleDateString('ko-KR') : '-'}</p>
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
                    
                    <div style="margin-top: 1.5rem; text-align: center;">
                        <button onclick="showEditProfileModal()" class="auth-submit-btn" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                            ✏️ 회원정보 수정
                        </button>
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
        
        // 구매 목록을 로컬스토리지에 저장
        const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
        purchases.push({
            prompt_id: promptId,
            prompt_title: promptTitle,
            price: price,
            purchased_at: new Date().toISOString()
        });
        localStorage.setItem('user_purchases', JSON.stringify(purchases));
        
        alert('✅ ' + response.message + '\n\n이제 전체 프롬프트를 확인하실 수 있습니다!');
        
        // 모달 닫기
        document.getElementById('modalClose').click();
        
        // 프롬프트 다시 열기 (이제 전체가 보임)
        setTimeout(() => {
            const prompt = promptsDatabase.find(p => p.id === promptId);
            if (prompt && typeof openModal === 'function') {
                openModal(prompt);
            }
        }, 500);
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

// ==================== 회원정보 수정 ====================

function showEditProfileModal() {
    const user = AuthManager.getUser();
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    // 먼저 최신 사용자 정보를 가져옴
    apiRequest('/api/user/me', 'GET').then(data => {
        const modalHTML = `
            <div class="auth-modal" id="editProfileModal">
                <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
                <div class="auth-modal-content" style="max-width: 500px;">
                    <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                    <h2 class="auth-modal-title">✏️ 회원정보 수정</h2>
                    
                    <form id="editProfileForm" onsubmit="handleEditProfile(event)">
                        <div class="form-group">
                            <label>이메일 (변경 불가)</label>
                            <input type="email" value="${data.user.email}" disabled style="background: #f3f4f6; cursor: not-allowed;">
                        </div>
                        
                        <div class="form-group">
                            <label>이름</label>
                            <input type="text" name="username" value="${data.user.username}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>전화번호</label>
                            <input type="tel" name="phone" value="${data.user.phone || ''}" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}" required>
                            <small style="color: #6b7280; font-size: 0.875rem;">형식: 010-1234-5678</small>
                        </div>
                        
                        <div class="form-group">
                            <label>생년월일</label>
                            <input type="date" name="birthdate" value="${data.user.birthdate ? data.user.birthdate : ''}" required>
                        </div>
                        
                        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">
                        
                        <div class="form-group">
                            <label>비밀번호 변경 (선택사항)</label>
                            <input type="password" name="current_password" placeholder="현재 비밀번호">
                        </div>
                        
                        <div class="form-group">
                            <label>새 비밀번호</label>
                            <input type="password" name="new_password" placeholder="새 비밀번호 (8자 이상)" minlength="8">
                        </div>
                        
                        <button type="submit" class="auth-submit-btn">수정 완료</button>
                    </form>
                    
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; text-align: center;">
                        <button onclick="showDeleteAccountModal()" style="color: #dc2626; background: none; border: none; cursor: pointer; text-decoration: underline;">
                            회원 탈퇴
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }).catch(error => {
        alert('사용자 정보를 불러오는데 실패했습니다: ' + error.message);
    });
}

async function handleEditProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        username: formData.get('username'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate')
    };
    
    // 비밀번호 변경이 있을 경우에만 추가
    const currentPassword = formData.get('current_password');
    const newPassword = formData.get('new_password');
    
    if (currentPassword && newPassword) {
        if (newPassword.length < 8) {
            alert('새 비밀번호는 8자 이상이어야 합니다.');
            return;
        }
        data.current_password = currentPassword;
        data.new_password = newPassword;
    } else if (currentPassword || newPassword) {
        alert('비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
        return;
    }
    
    try {
        const response = await apiRequest('/api/user/update', 'PUT', data);
        
        // 로컬 스토리지의 사용자 정보 업데이트
        AuthManager.setUser(response.user);
        
        alert('✅ ' + response.message);
        closeAuthModal();
        
        // UI 업데이트
        updateUIForLoggedInUser(response.user);
        
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==================== 회원 탈퇴 ====================

function showDeleteAccountModal() {
    closeAuthModal(); // 기존 모달 닫기
    
    const modalHTML = `
        <div class="auth-modal" id="deleteAccountModal">
            <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
            <div class="auth-modal-content" style="max-width: 450px;">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title" style="color: #dc2626;">⚠️ 회원 탈퇴</h2>
                <p class="auth-modal-subtitle">정말로 탈퇴하시겠습니까?</p>
                
                <div style="background: #fef2f2; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #ef4444;">
                    <p style="color: #991b1b; font-size: 0.9375rem; margin-bottom: 0.5rem;"><strong>⚠️ 주의사항</strong></p>
                    <ul style="color: #991b1b; font-size: 0.875rem; padding-left: 1.25rem; margin: 0;">
                        <li>구매한 프롬프트는 더 이상 사용할 수 없습니다</li>
                        <li>작성한 게시글과 댓글이 모두 삭제됩니다</li>
                        <li>탈퇴 후 동일 이메일로 재가입할 수 있습니다</li>
                        <li>결제 내역은 법적 보관 기간 동안 보관됩니다</li>
                    </ul>
                </div>
                
                <form id="deleteAccountForm" onsubmit="handleDeleteAccount(event)">
                    <div class="form-group">
                        <label>비밀번호 확인</label>
                        <input type="password" name="password" placeholder="비밀번호를 입력하세요" required>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="confirm" required>
                            <span>위 내용을 확인했으며 회원 탈퇴에 동의합니다</span>
                        </label>
                    </div>
                    
                    <button type="submit" class="auth-submit-btn" style="background: #dc2626;">
                        탈퇴하기
                    </button>
                </form>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <button onclick="closeAuthModal()" style="color: #6b7280; background: none; border: none; cursor: pointer;">
                        취소
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handleDeleteAccount(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    
    if (!confirm) {
        alert('탈퇴 동의에 체크해주세요.');
        return;
    }
    
    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    try {
        const response = await apiRequest('/api/user/delete', 'DELETE', {
            password: password
        });
        
        alert('✅ ' + response.message);
        
        // 로그아웃 처리
        AuthManager.logout();
        closeAuthModal();
        
        // 페이지 새로고침
        window.location.reload();
        
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
