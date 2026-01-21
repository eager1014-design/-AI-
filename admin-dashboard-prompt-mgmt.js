// ==================== 회원 프롬프트 관리 ====================

let currentEditingUserId = null;
let allPrompts = [];

// 프롬프트 데이터 로드
async function loadPromptsData() {
    if (typeof promptsData !== 'undefined') {
        allPrompts = promptsData;
    } else {
        allPrompts = [
            {id: 0, title: 'AI 활용 능력 진단', icon: '🎯'},
            {id: 1, title: '인스타그램 바이럴 카피라이팅', icon: '📸'},
            {id: 2, title: '유튜브 썸네일 제목 생성기', icon: '🎬'},
            {id: 3, title: '블로그 SEO 최적화 글쓰기', icon: '📝'},
            {id: 4, title: '브랜드 스토리텔링', icon: '💎'},
            {id: 5, title: 'ChatGPT 프롬프트 엔지니어링', icon: '🔧'},
            {id: 6, title: '릴스/쇼츠 대본 생성기', icon: '📱'},
            {id: 7, title: '이메일 마케팅 시퀀스', icon: '📧'},
            {id: 8, title: '카카오톡 채널 운영', icon: '💬'},
            {id: 9, title: 'GPT 크리에이터 VIP 클럽', icon: '⭐'},
            {id: 10, title: '상위 0.1% 프롬프트 라이브러리', icon: '⭐'},
            {id: 11, title: '유튜브 업로드 수익화 프롬프트', icon: '💰'},
            {id: 12, title: 'ChatGPT 객관적 결과 도출 프롬프트', icon: '🎯'},
            {id: 13, title: '나만의 AI 어시스턴트 프롬프트', icon: '🤖'}
        ];
    }
}

// 회원 프롬프트 목록 로드
async function loadUsersWithPrompts() {
    try {
        const API_BASE = '';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE}/api/admin/users-with-prompts`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        
        if (!response.ok) throw new Error('Failed to load users');
        
        const data = await response.json();
        renderUsersPromptsTable(data.users);
        
    } catch (error) {
        console.error('회원 목록 로드 실패:', error);
        const tbody = document.getElementById('users-prompts-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="error">회원 목록을 불러오는데 실패했습니다.</td></tr>';
        }
    }
}

// 회원 프롬프트 테이블 렌더링
function renderUsersPromptsTable(users) {
    const tbody = document.getElementById('users-prompts-tbody');
    if (!tbody) return;
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">회원이 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const statusBadge = {
            'free': '<span style="background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600;">무료</span>',
            'monthly': '<span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600;">월 구독</span>',
            'annual': '<span style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600;">연간 구독</span>'
        };
        
        const assignedCount = user.assigned_prompts ? user.assigned_prompts.length : 0;
        
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}${user.is_admin ? ' ⭐' : ''}</td>
                <td>${user.email}</td>
                <td>${statusBadge[user.subscription_status] || statusBadge.free}</td>
                <td>
                    <span style="display: inline-block; padding: 0.25rem 0.75rem; background: #eff6ff; color: #1e40af; border-radius: 6px; font-weight: 600; font-size: 0.875rem;">
                        ${assignedCount}개
                    </span>
                </td>
                <td>${new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
                <td>
                    <button onclick="openAssignModal(${user.id})" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.875rem;">
                        관리
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 프롬프트 할당 모달 열기
async function openAssignModal(userId) {
    currentEditingUserId = userId;
    
    try {
        const API_BASE = '';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE}/api/admin/users-with-prompts`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        
        if (!response.ok) throw new Error('Failed to load user');
        
        const data = await response.json();
        const user = data.users.find(u => u.id === userId);
        
        if (!user) {
            alert('사용자를 찾을 수 없습니다.');
            return;
        }
        
        document.getElementById('assignModalUsername').textContent = user.username;
        document.getElementById('assignModalEmail').textContent = user.email;
        document.getElementById('subscriptionStatusSelect').value = user.subscription_status || 'free';
        
        await loadPromptsData();
        const checkboxList = document.getElementById('promptCheckboxList');
        checkboxList.innerHTML = allPrompts.map(prompt => {
            const isChecked = user.assigned_prompts && user.assigned_prompts.includes(prompt.id);
            return `
                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">
                    <input type="checkbox" 
                           id="prompt-${prompt.id}" 
                           value="${prompt.id}" 
                           ${isChecked ? 'checked' : ''}
                           style="width: 20px; height: 20px; cursor: pointer;">
                    <label for="prompt-${prompt.id}" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem; flex: 1;">
                        <span style="font-size: 1.5rem;">${prompt.icon}</span>
                        <span style="font-weight: 500;">${prompt.title}</span>
                    </label>
                </div>
            `;
        }).join('');
        
        document.getElementById('assignPromptModal').style.display = 'flex';
        
    } catch (error) {
        console.error('모달 열기 실패:', error);
        alert('오류가 발생했습니다.');
    }
}

// 프롬프트 할당 모달 닫기
function closeAssignModal() {
    const modal = document.getElementById('assignPromptModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentEditingUserId = null;
}

// 프롬프트 할당 저장
async function savePromptAssignment() {
    if (!currentEditingUserId) return;
    
    try {
        const API_BASE = '';
        const token = localStorage.getItem('token');
        
        const checkboxes = document.querySelectorAll('#promptCheckboxList input[type="checkbox"]:checked');
        const selectedPromptIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        const subscriptionStatus = document.getElementById('subscriptionStatusSelect').value;
        
        // 프롬프트 할당
        const promptResponse = await fetch(`${API_BASE}/api/admin/user/${currentEditingUserId}/prompts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({prompt_ids: selectedPromptIds})
        });
        
        if (!promptResponse.ok) throw new Error('Failed to assign prompts');
        
        // 구독 상태 업데이트
        const subscriptionResponse = await fetch(`${API_BASE}/api/admin/user/${currentEditingUserId}/subscription`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                subscription_status: subscriptionStatus,
                subscription_end: subscriptionStatus !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
            })
        });
        
        if (!subscriptionResponse.ok) throw new Error('Failed to update subscription');
        
        alert('✅ 저장되었습니다!');
        closeAssignModal();
        loadUsersWithPrompts();
        
    } catch (error) {
        console.error('저장 실패:', error);
        alert('❌ 저장에 실패했습니다.');
    }
}

// 탭 전환 시 데이터 로드
window.addEventListener('DOMContentLoaded', function() {
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tabName) {
        if (originalSwitchTab) originalSwitchTab(tabName);
        
        if (tabName === 'prompt-management') {
            loadUsersWithPrompts();
        }
    };
});
