// ==================== 인증 관리 ====================

const API_BASE_URL = window.location.origin;

// 토큰 저장/조회/삭제
const AuthManager = {
    setToken(token, remember = false) {
        if (remember) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('remember_me', 'true');
        } else {
            sessionStorage.setItem('auth_token', token);
            localStorage.removeItem('remember_me');
        }
    },
    
    getToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    },
    
    removeToken() {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('remember_me');
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
    
    isRememberMe() {
        return localStorage.getItem('remember_me') === 'true';
    },
    
    logout() {
        this.removeToken();
        this.removeUser();
        location.reload();
    },
    
    // 로그인 연장
    async refreshSession() {
        try {
            const response = await apiRequest('/api/auth/refresh', 'POST');
            this.setToken(response.token, this.isRememberMe());
            this.setUser(response.user);
            return true;
        } catch (error) {
            console.error('세션 연장 실패:', error);
            return false;
        }
    },
    
    // 자동 로그인 체크 및 세션 유지
    async checkAndRefreshSession() {
        if (!this.isLoggedIn()) return false;
        
        // 로그인 상태라면 토큰 검증 및 갱신
        try {
            const response = await apiRequest('/api/user/me');
            if (response && response.id) {
                // 자동 로그인이 활성화된 경우 세션 자동 연장
                if (this.isRememberMe()) {
                    await this.refreshSession();
                }
                return true;
            }
        } catch (error) {
            // 토큰이 만료되었거나 유효하지 않으면 로그아웃
            console.error('세션 검증 실패:', error);
            this.logout();
            return false;
        }
    },
    
    // 로그인 시간 표시 및 연장 버튼 활성화
    startSessionTimer() {
        // 50분마다 알림 (1시간 = 60분, 10분 전에 알림)
        setInterval(() => {
            if (this.isLoggedIn() && !this.isRememberMe()) {
                this.showSessionExpiryWarning();
            }
        }, 50 * 60 * 1000); // 50분
    },
    
    showSessionExpiryWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 350px;
        `;
        warningDiv.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: bold; color: #92400e; margin-bottom: 10px;">
                ⏰ 세션 만료 10분 전
            </div>
            <div style="color: #78350f; margin-bottom: 15px;">
                로그인 세션이 곧 만료됩니다.
            </div>
            <button onclick="AuthManager.refreshSession().then(() => { alert('로그인이 1시간 연장되었습니다!'); this.parentElement.remove(); })" 
                style="background: #f59e0b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%;">
                로그인 연장하기 (1시간)
            </button>
            <button onclick="this.parentElement.remove()" 
                style="background: #e5e7eb; color: #374151; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 8px; width: 100%;">
                닫기
            </button>
        `;
        document.body.appendChild(warningDiv);
        
        // 5초 후 자동으로 닫기 (사용자가 수동으로 닫지 않은 경우)
        setTimeout(() => {
            if (document.body.contains(warningDiv)) {
                warningDiv.remove();
            }
        }, 30000); // 30초 후 자동 닫기
    }
};

// ==================== 로컬스토리지 기반 가짜 인증 시스템 ====================

// 사용자 데이터베이스 (localStorage)
const FakeAuthDB = {
    USERS_KEY: 'fake_users_db',
    
    // 초기 관리자 계정 생성
    initializeAdmin() {
        const users = this.getAllUsers();
        const adminExists = users.some(u => u.is_admin);
        
        if (!adminExists) {
            const adminUser = {
                id: 1,
                username: '관리자',
                email: 'admin@jinbubu.com',
                phone: '010-0000-0000',
                birthdate: '1990-01-01',
                password: 'admin1234',
                is_member: true,
                is_admin: true,
                in_welcome_period: false,
                created_at: new Date().toISOString()
            };
            users.push(adminUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            console.log('✅ 관리자 계정 생성 완료!');
            console.log('📧 이메일: admin@jinbubu.com');
            console.log('🔑 비밀번호: admin1234');
        }
    },
    
    // 모든 사용자 가져오기
    getAllUsers() {
        const usersStr = localStorage.getItem(this.USERS_KEY);
        return usersStr ? JSON.parse(usersStr) : [];
    },
    
    // 사용자 저장
    saveUser(user) {
        const users = this.getAllUsers();
        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },
    
    // 이메일로 사용자 찾기
    findUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(u => u.email === email);
    },
    
    // 사용자 정보 업데이트
    updateUser(email, updates) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.email === email);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return users[index];
        }
        return null;
    },
    
    // 사용자 삭제
    deleteUser(email) {
        const users = this.getAllUsers();
        const filtered = users.filter(u => u.email !== email);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(filtered));
    }
};

// 페이지 로드 시 관리자 계정 초기화
FakeAuthDB.initializeAdmin();

// API 요청 헬퍼 (로컬스토리지 기반)
async function apiRequest(endpoint, method = 'GET', body = null) {
    console.log('API 요청:', endpoint, method, body);
    
    // 가짜 API 지연 시뮬레이션 (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
        // 회원가입
        if (endpoint === '/api/register' && method === 'POST') {
            // 이메일 중복 체크
            if (FakeAuthDB.findUserByEmail(body.email)) {
                throw new Error('이미 가입된 이메일입니다.');
            }
            
            // 새 사용자 생성
            const newUser = {
                id: Date.now(),
                username: body.username,
                email: body.email,
                phone: body.phone,
                birthdate: body.birthdate,
                password: body.password, // 실제로는 해시해야 하지만 데모용
                is_member: body.is_member || false,
                is_admin: false,
                in_welcome_period: true,
                created_at: new Date().toISOString()
            };
            
            FakeAuthDB.saveUser(newUser);
            
            // 토큰 생성 (단순 Base64 인코딩)
            const token = btoa(JSON.stringify({ email: newUser.email, id: newUser.id }));
            
            return {
                success: true,
                message: '회원가입이 완료되었습니다!',
                token: token,
                user: { ...newUser, password: undefined } // 비밀번호 제외
            };
        }
        
        // 로그인
        if (endpoint === '/api/login' && method === 'POST') {
            const user = FakeAuthDB.findUserByEmail(body.email);
            
            if (!user) {
                throw new Error('존재하지 않는 이메일입니다.');
            }
            
            if (user.password !== body.password) {
                throw new Error('비밀번호가 일치하지 않습니다.');
            }
            
            // 토큰 생성
            const token = btoa(JSON.stringify({ email: user.email, id: user.id }));
            
            return {
                success: true,
                message: '로그인 성공!',
                token: token,
                user: { ...user, password: undefined }
            };
        }
        
        // 사용자 정보 조회
        if (endpoint === '/api/user/me' && method === 'GET') {
            const token = AuthManager.getToken();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            
            const decoded = JSON.parse(atob(token));
            const user = FakeAuthDB.findUserByEmail(decoded.email);
            
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            
            // 구매 내역 조회
            const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
            
            return {
                user: { ...user, password: undefined },
                purchases: purchases
            };
        }
        
        // 사용자 정보 수정
        if (endpoint === '/api/user/update' && method === 'PUT') {
            const token = AuthManager.getToken();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            
            const decoded = JSON.parse(atob(token));
            const user = FakeAuthDB.findUserByEmail(decoded.email);
            
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            
            // 비밀번호 변경 체크
            if (body.current_password) {
                if (user.password !== body.current_password) {
                    throw new Error('현재 비밀번호가 일치하지 않습니다.');
                }
                if (body.new_password) {
                    body.password = body.new_password;
                }
                delete body.current_password;
                delete body.new_password;
            }
            
            // 사용자 정보 업데이트
            const updatedUser = FakeAuthDB.updateUser(decoded.email, body);
            
            return {
                success: true,
                message: '회원정보가 수정되었습니다!',
                user: { ...updatedUser, password: undefined }
            };
        }
        
        // 회원 탈퇴
        if (endpoint === '/api/user/delete' && method === 'DELETE') {
            const token = AuthManager.getToken();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            
            const decoded = JSON.parse(atob(token));
            const user = FakeAuthDB.findUserByEmail(decoded.email);
            
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            
            if (user.password !== body.password) {
                throw new Error('비밀번호가 일치하지 않습니다.');
            }
            
            FakeAuthDB.deleteUser(decoded.email);
            
            return {
                success: true,
                message: '회원 탈퇴가 완료되었습니다.'
            };
        }
        
        // 비밀번호 찾기 요청
        if (endpoint === '/api/password/reset-request' && method === 'POST') {
            const user = FakeAuthDB.findUserByEmail(body.email);
            
            if (!user) {
                throw new Error('존재하지 않는 이메일입니다.');
            }
            
            if (user.phone !== body.phone) {
                throw new Error('전화번호가 일치하지 않습니다.');
            }
            
            // 리셋 토큰 생성
            const resetToken = btoa(JSON.stringify({ 
                email: body.email, 
                timestamp: Date.now() 
            }));
            
            return {
                success: true,
                message: '본인 인증이 완료되었습니다. 새 비밀번호를 설정해주세요.',
                reset_token: resetToken,
                email: body.email
            };
        }
        
        // 비밀번호 재설정
        if (endpoint === '/api/password/reset' && method === 'POST') {
            const decoded = JSON.parse(atob(body.reset_token));
            
            // 15분 만료 체크
            const fifteenMinutes = 15 * 60 * 1000;
            if (Date.now() - decoded.timestamp > fifteenMinutes) {
                throw new Error('링크가 만료되었습니다. 다시 시도해주세요.');
            }
            
            const user = FakeAuthDB.findUserByEmail(decoded.email);
            
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            
            // 비밀번호 업데이트
            FakeAuthDB.updateUser(decoded.email, { password: body.new_password });
            
            return {
                success: true,
                message: '비밀번호가 변경되었습니다!'
            };
        }
        
        // 세션 갱신 (자동 로그인)
        if (endpoint === '/api/auth/refresh' && method === 'POST') {
            const token = AuthManager.getToken();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            
            const decoded = JSON.parse(atob(token));
            const user = FakeAuthDB.findUserByEmail(decoded.email);
            
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            
            // 새 토큰 생성
            const newToken = btoa(JSON.stringify({ 
                email: user.email, 
                id: user.id,
                refreshed_at: Date.now()
            }));
            
            return {
                success: true,
                token: newToken,
                user: { ...user, password: undefined }
            };
        }
        
        // 프롬프트 구매
        if (endpoint === '/api/purchase' && method === 'POST') {
            const token = AuthManager.getToken();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            
            return {
                success: true,
                message: '프롬프트 구매가 완료되었습니다!'
            };
        }
        
        throw new Error('알 수 없는 API 엔드포인트: ' + endpoint);
        
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
                
                <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid #3b82f6;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <strong style="color: #1e40af; font-size: 1rem;">회원제 가입 안내</strong>
                    </div>
                    <p style="color: #1e3a8a; font-size: 0.875rem; margin: 0.5rem 0 0.75rem 0; line-height: 1.5;">
                        회원가입 방법과 혜택이 궁금하신가요?<br>
                        자세한 가입 절차와 프롬프트 사용법을 확인하세요!
                    </p>
                    <a href="/membership-guide.html" target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 0.6rem 1.2rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: transform 0.2s;">
                        <span>📖</span>
                        <span>회원제 가입 안내 보기</span>
                        <span>→</span>
                    </a>
                </div>
                
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
                        <input type="tel" id="registerPhone" name="phone" placeholder="01012345678" maxlength="13" required oninput="autoHyphenPhone(this)">
                        <small style="color: #6b7280; font-size: 0.875rem;">숫자만 입력하면 자동으로 하이픈이 추가됩니다</small>
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
        
        // Remember Me로 토큰 저장 (자동 로그인)
        AuthManager.setToken(response.token, true);
        AuthManager.setUser(response.user);
        
        showSuccessNotification('회원가입이 완료되었습니다! 🎉');
        closeAuthModal();
        updateUIForLoggedInUser(response.user);
        
        // returnUrl이 있으면 해당 페이지로, 없으면 새로고침
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
            localStorage.removeItem('returnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } else {
            // 페이지 새로고침하여 프롬프트 가격 업데이트
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (error) {
        console.error('회원가입 에러 상세:', error);
        alert('❌ 회원가입 실패\n\n' + error.message + '\n\n콘솔을 확인해주세요.');
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
                
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid #f59e0b;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">💡</span>
                        <strong style="color: #92400e; font-size: 1rem;">처음 방문하셨나요?</strong>
                    </div>
                    <p style="color: #78350f; font-size: 0.875rem; margin: 0.5rem 0 0.75rem 0; line-height: 1.5;">
                        회원제 가입 안내를 먼저 확인하시면<br>
                        더 쉽고 빠르게 가입하실 수 있습니다!
                    </p>
                    <a href="/membership-guide.html" target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 0.6rem 1.2rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: transform 0.2s;">
                        <span>📖</span>
                        <span>회원제 가입 안내 보기</span>
                        <span>→</span>
                    </a>
                </div>
                
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" placeholder="비밀번호" required>
                    </div>
                    <div class="form-group checkbox-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" name="remember" checked style="width: 20px; height: 20px; cursor: pointer;">
                            <span style="font-size: 0.9rem; color: #374151;">로그인 상태 유지 (자동 로그인)</span>
                        </label>
                    </div>
                    <button type="submit" class="auth-submit-btn">로그인</button>
                </form>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <a href="#" onclick="showPasswordResetModal(); return false;" style="color: #6b7280; font-size: 0.875rem; text-decoration: underline;">
                        비밀번호를 잊으셨나요?
                    </a>
                </div>
                
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
    const remember = formData.get('remember') === 'on';
    
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await apiRequest('/api/login', 'POST', data);
        
        // Remember Me 설정에 따라 토큰 저장
        AuthManager.setToken(response.token, remember);
        AuthManager.setUser(response.user);
        
        // 관리자인 경우 대시보드로 이동
        if (response.user.is_admin) {
            showSuccessNotification('관리자로 로그인되었습니다!');
            closeAuthModal();
            setTimeout(() => {
                window.location.href = '/admin-dashboard.html';
            }, 1000);
            return;
        }
        
        showSuccessNotification('로그인 성공! 환영합니다 😊');
        closeAuthModal();
        updateUIForLoggedInUser(response.user);
        
        // 페이지 새로고침하여 프롬프트 가격 업데이트
        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (error) {
        console.error('로그인 에러 상세:', error);
        alert('❌ 로그인 실패\n\n' + error.message + '\n\n📧 관리자 계정\n이메일: admin@jinbubu.com\n비밀번호: admin1234');
    }
}

// ==================== UI 업데이트 ====================

function closeAuthModal() {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => modal.remove());
}

// 이 함수는 902번 라인에 통합되었으므로 삭제됨

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

// 첫 번째 DOMContentLoaded는 840번 라인에 통합됨

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
                            <input type="tel" id="editPhone" name="phone" value="${data.user.phone || ''}" maxlength="13" required oninput="autoHyphenPhone(this)">
                            <small style="color: #6b7280; font-size: 0.875rem;">숫자만 입력하면 자동으로 하이픈이 추가됩니다</small>
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

// ==================== 비밀번호 찾기 ====================

function showPasswordResetModal() {
    closeAuthModal(); // 기존 모달 닫기
    
    const modalHTML = `
        <div class="auth-modal" id="passwordResetModal">
            <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
            <div class="auth-modal-content" style="max-width: 450px;">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title">🔑 비밀번호 찾기</h2>
                <p class="auth-modal-subtitle">가입 시 등록한 정보로 본인 인증을 해주세요</p>
                
                <form id="passwordResetRequestForm" onsubmit="handlePasswordResetRequest(event)">
                    <div class="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label>전화번호</label>
                        <input type="tel" id="resetPhone" name="phone" placeholder="01012345678" maxlength="13" required oninput="autoHyphenPhone(this)">
                        <small style="color: #6b7280; font-size: 0.875rem;">가입 시 등록한 전화번호를 입력해주세요</small>
                    </div>
                    
                    <button type="submit" class="auth-submit-btn">본인 인증</button>
                </form>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <a href="#" onclick="showLoginModal(); return false;" style="color: #6b7280; font-size: 0.875rem;">
                        ← 로그인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handlePasswordResetRequest(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    try {
        const response = await apiRequest('/api/password/reset-request', 'POST', data);
        
        alert('✅ ' + response.message);
        closeAuthModal();
        
        // 새 비밀번호 설정 모달 표시
        showPasswordResetFormModal(response.reset_token, response.email);
        
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

function showPasswordResetFormModal(resetToken, email) {
    const modalHTML = `
        <div class="auth-modal" id="passwordResetFormModal">
            <div class="auth-modal-overlay" onclick="closeAuthModal()"></div>
            <div class="auth-modal-content" style="max-width: 450px;">
                <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
                <h2 class="auth-modal-title">🔐 새 비밀번호 설정</h2>
                <p class="auth-modal-subtitle">${email}</p>
                
                <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #3b82f6;">
                    <p style="color: #1e40af; font-size: 0.875rem; margin: 0;">
                        ⏰ 이 링크는 <strong>15분</strong> 동안만 유효합니다.
                    </p>
                </div>
                
                <form id="passwordResetForm" onsubmit="handlePasswordReset(event, '${resetToken}')">
                    <div class="form-group">
                        <label>새 비밀번호</label>
                        <input type="password" name="new_password" placeholder="8자 이상" minlength="8" required>
                    </div>
                    
                    <div class="form-group">
                        <label>새 비밀번호 확인</label>
                        <input type="password" name="confirm_password" placeholder="비밀번호 재입력" minlength="8" required>
                    </div>
                    
                    <button type="submit" class="auth-submit-btn">비밀번호 변경</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handlePasswordReset(event, resetToken) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newPassword = formData.get('new_password');
    const confirmPassword = formData.get('confirm_password');
    
    // 비밀번호 확인
    if (newPassword !== confirmPassword) {
        alert('❌ 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (newPassword.length < 8) {
        alert('❌ 비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    try {
        const response = await apiRequest('/api/password/reset', 'POST', {
            reset_token: resetToken,
            new_password: newPassword
        });
        
        alert('✅ ' + response.message + '\n로그인 페이지로 이동합니다.');
        closeAuthModal();
        showLoginModal();
        
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==================== 페이지 로드 시 자동 로그인 및 세션 관리 ====================

// DOMContentLoaded 이벤트에서 자동 로그인 체크
document.addEventListener('DOMContentLoaded', async () => {
    console.log('페이지 초기화 시작...');
    
    // 1. 자동 로그인 체크 및 세션 갱신
    await AuthManager.checkAndRefreshSession();
    
    // 2. UI 업데이트
    const currentUser = AuthManager.getUser();
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
        console.log('로그인 상태:', currentUser.email);
    } else {
        updateUIForLoggedInUser(null);
        console.log('비로그인 상태');
    }
    
    // 3. 세션 타이머 시작 (로그인 만료 10분 전 알림)
    if (AuthManager.isLoggedIn()) {
        AuthManager.startSessionTimer();
        console.log('세션 타이머 시작 완료');
    }
    
    // 4. 사용자 메뉴 드롭다운 이벤트 설정
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // 5. 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', () => {
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
    });
    
    console.log('페이지 초기화 완료');
    
    // 6. 프롬프트 렌더링 트리거 (script.js의 renderPrompts 호출)
    if (typeof renderPrompts === 'function') {
        console.log('프롬프트 렌더링 시작...');
        renderPrompts();
    } else {
        console.warn('renderPrompts 함수를 찾을 수 없습니다. script.js가 로드되었는지 확인하세요.');
    }
});

// ==================== UI 업데이트 함수 ====================

// 로그인 상태에 따른 UI 업데이트
function updateUIForLoggedInUser(user) {
    console.log('UI 업데이트:', user);
    
    // DOM 요소 존재 여부 확인
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const extendLoginBtn = document.getElementById('extendLoginBtn');
    const adminBtn = document.getElementById('adminBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (!user || !user.id) {
        // 비로그인 상태
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (extendLoginBtn) extendLoginBtn.style.display = 'none';
        if (adminBtn) adminBtn.style.display = 'none';
        return;
    }
    
    // 로그인 상태
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (extendLoginBtn) extendLoginBtn.style.display = 'inline-flex';
    
    // 사용자 이름 표시
    const userName = user.username || user.email.split('@')[0];
    if (userNameDisplay) userNameDisplay.textContent = `👤 ${userName}`;
    
    // 관리자인 경우 관리자 버튼 표시
    if (user.is_admin && adminBtn) {
        adminBtn.style.display = 'inline-flex';
    }
    
    // 3시간 특별가 배너 표시
    if (user.in_welcome_period) {
        const welcomeBanner = document.getElementById('welcomeBanner');
        if (welcomeBanner) {
            welcomeBanner.style.display = 'block';
        }
        // 3시간 타이머 시작
        if (typeof startWelcomeTimer === 'function') {
            startWelcomeTimer();
        }
    } else {
        // 타이머 중지
        if (typeof stopWelcomeTimer === 'function') {
            stopWelcomeTimer();
        }
    }
    
    // 프롬프트 카드 다시 렌더링 (가격 업데이트)
    if (typeof renderPrompts === 'function') {
        renderPrompts();
    }
}

// 사용자 메뉴 토글
// 세 번째 DOMContentLoaded도 840번 라인에 통합됨

// 로그인 연장 함수
async function extendLoginSession() {
    try {
        const btn = document.getElementById('extendLoginBtn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>⏳</span><span>연장 중...</span>';
        btn.disabled = true;
        
        const success = await AuthManager.refreshSession();
        
        if (success) {
            btn.innerHTML = '<span>✅</span><span>연장 완료!</span>';
            
            // 알림 표시
            showSuccessNotification('로그인이 1시간 연장되었습니다!');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        } else {
            throw new Error('연장 실패');
        }
    } catch (error) {
        console.error('로그인 연장 실패:', error);
        alert('❌ 로그인 연장에 실패했습니다. 다시 로그인해주세요.');
        AuthManager.logout();
    }
}

// 성공 알림 표시
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 사용자 대시보드 표시
function showUserDashboard() {
    alert('사용자 대시보드 기능은 준비 중입니다.');
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    #userMenuBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    #extendLoginBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// ==================== 3시간 특별가 타이머 ====================
let welcomeTimerInterval = null;

function startWelcomeTimer() {
    const user = AuthManager.getUser();
    if (!user || !user.created_at || !user.in_welcome_period) {
        stopWelcomeTimer();
        return;
    }
    
    const welcomeTimerDisplay = document.getElementById('welcomeTimerDisplay');
    const welcomeTimerText = document.getElementById('welcomeTimerText');
    
    if (!welcomeTimerDisplay || !welcomeTimerText) {
        return;
    }
    
    // 3시간(10800초) = 3 * 60 * 60
    const WELCOME_PERIOD_SECONDS = 3 * 60 * 60;
    
    function updateTimer() {
        try {
            const now = new Date();
            const createdAt = new Date(user.created_at);
            const elapsedSeconds = Math.floor((now - createdAt) / 1000);
            const remainingSeconds = WELCOME_PERIOD_SECONDS - elapsedSeconds;
            
            if (remainingSeconds <= 0) {
                // 3시간 만료됨
                welcomeTimerText.textContent = '특별가 종료! 회원 50% 할인 적용중';
                welcomeTimerDisplay.style.background = 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
                
                // 사용자 정보 업데이트
                user.in_welcome_period = false;
                AuthManager.setUser(user);
                
                // 타이머 중지
                stopWelcomeTimer();
                
                // 5초 후 타이머 숨기기
                setTimeout(() => {
                    welcomeTimerDisplay.style.display = 'none';
                    // 페이지 새로고침하여 가격 업데이트
                    location.reload();
                }, 5000);
                
                return;
            }
            
            // 시간 계산
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            
            // 타이머 텍스트 업데이트
            const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            welcomeTimerText.textContent = `🎁 특별가 종료까지: ${timeStr}`;
            
            // 30분 미만일 때 색상 변경
            if (remainingSeconds < 30 * 60) {
                welcomeTimerDisplay.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
            } else if (remainingSeconds < 60 * 60) {
                welcomeTimerDisplay.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
            }
            
            // 타이머 표시
            welcomeTimerDisplay.style.display = 'flex';
            welcomeTimerDisplay.style.alignItems = 'center';
            welcomeTimerDisplay.style.gap = '0.5rem';
            
        } catch (error) {
            console.error('타이머 업데이트 오류:', error);
            stopWelcomeTimer();
        }
    }
    
    // 즉시 한 번 실행
    updateTimer();
    
    // 1초마다 업데이트
    stopWelcomeTimer(); // 기존 타이머 정리
    welcomeTimerInterval = setInterval(updateTimer, 1000);
}

function stopWelcomeTimer() {
    if (welcomeTimerInterval) {
        clearInterval(welcomeTimerInterval);
        welcomeTimerInterval = null;
    }
    
    const welcomeTimerDisplay = document.getElementById('welcomeTimerDisplay');
    if (welcomeTimerDisplay) {
        welcomeTimerDisplay.style.display = 'none';
    }
}

// ==================== 전화번호 자동 하이픈 ====================

function autoHyphenPhone(input) {
    // 숫자만 추출
    let value = input.value.replace(/[^0-9]/g, '');
    
    // 최대 11자리까지만
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // 하이픈 자동 추가
    let formattedValue = '';
    
    if (value.length <= 3) {
        formattedValue = value;
    } else if (value.length <= 7) {
        // 010-1234
        formattedValue = value.substring(0, 3) + '-' + value.substring(3);
    } else if (value.length <= 10) {
        // 010-123-4567 (10자리)
        formattedValue = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6);
    } else {
        // 010-1234-5678 (11자리)
        formattedValue = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7);
    }
    
    input.value = formattedValue;
}

