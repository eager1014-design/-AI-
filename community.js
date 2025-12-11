// 커뮤니티 상태 관리
let currentCategory = 'all';
let currentPage = 1;
let totalPages = 1;

// 페이지 로드 시 게시글 목록 가져오기
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});

// 카테고리 필터링
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    // 탭 활성화 상태 변경
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
    
    loadPosts();
}

// 게시글 목록 로드
async function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">로딩 중...</p>';
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            per_page: 10
        });
        
        if (currentCategory !== 'all') {
            params.append('category', currentCategory);
        }
        
        const response = await fetch(`/api/posts?${params}`);
        const data = await response.json();
        
        if (data.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>아직 게시글이 없어요</h3>
                    <p>첫 번째 게시글을 작성해보세요!</p>
                </div>
            `;
            return;
        }
        
        totalPages = data.pages;
        renderPosts(data.posts);
        renderPagination();
    } catch (error) {
        console.error('게시글을 불러올 수 없습니다:', error);
        postsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😢</div>
                <h3>게시글을 불러올 수 없습니다</h3>
                <p>잠시 후 다시 시도해주세요.</p>
            </div>
        `;
    }
}

// 게시글 렌더링
function renderPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card" onclick="openPostDetail(${post.id})">
            <div class="post-header">
                <span class="post-category">${getCategoryIcon(post.category)} ${post.category}</span>
                <div class="post-meta">
                    <span>${post.username}</span> · 
                    <span>${formatDate(post.created_at)}</span>
                </div>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-content">${escapeHtml(post.content)}</p>
            <div class="post-stats">
                <div class="stat-item">
                    <span>👁️</span>
                    <span>${post.views}</span>
                </div>
                <div class="stat-item">
                    <span>❤️</span>
                    <span>${post.likes}</span>
                </div>
                <div class="stat-item">
                    <span>💬</span>
                    <span>${post.comment_count}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 페이지네이션 렌더링
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let buttons = [];
    
    // 이전 버튼
    if (currentPage > 1) {
        buttons.push(`<button class="page-btn" onclick="changePage(${currentPage - 1})">◀</button>`);
    }
    
    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            buttons.push(`<button class="page-btn active">${i}</button>`);
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            buttons.push(`<button class="page-btn" onclick="changePage(${i})">${i}</button>`);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            buttons.push(`<span style="padding: 8px;">...</span>`);
        }
    }
    
    // 다음 버튼
    if (currentPage < totalPages) {
        buttons.push(`<button class="page-btn" onclick="changePage(${currentPage + 1})">▶</button>`);
    }
    
    paginationContainer.innerHTML = buttons.join('');
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 글쓰기 모달 열기
function openWriteModal() {
    if (!AuthManager.isLoggedIn()) {
        alert('⚠️ 로그인이 필요합니다!');
        showLoginModal();
        return;
    }
    
    document.getElementById('writeModal').style.display = 'flex';
}

// 글쓰기 모달 닫기
function closeWriteModal() {
    document.getElementById('writeModal').style.display = 'none';
    document.getElementById('writeForm').reset();
}

// 게시글 작성
async function handleSubmitPost(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        category: formData.get('category'),
        title: formData.get('title'),
        content: formData.get('content')
    };
    
    try {
        const response = await apiRequest('/api/posts', 'POST', data);
        alert('✅ ' + response.message);
        closeWriteModal();
        loadPosts();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// 게시글 상세 보기
async function openPostDetail(postId) {
    const modal = document.getElementById('postDetailModal');
    const content = document.getElementById('postDetailContent');
    
    modal.style.display = 'flex';
    content.innerHTML = '<p style="text-align: center; padding: 40px;">로딩 중...</p>';
    
    try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();
        const post = data.post;
        const comments = data.comments;
        
        const user = AuthManager.getUser();
        const isAuthor = user && user.id === post.user_id;
        
        content.innerHTML = `
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="post-category">${getCategoryIcon(post.category)} ${post.category}</span>
                    ${isAuthor ? `
                        <div style="display: flex; gap: 8px;">
                            <button onclick="deletePost(${post.id})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;">삭제</button>
                        </div>
                    ` : ''}
                </div>
                <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 12px;">${escapeHtml(post.title)}</h2>
                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 16px;">
                    <span>${post.username}</span> · 
                    <span>${formatDate(post.created_at)}</span> · 
                    <span>👁️ ${post.views}</span>
                </div>
                <div style="padding: 24px 0; border-top: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; line-height: 1.8; white-space: pre-wrap;">
                    ${escapeHtml(post.content)}
                </div>
                <div style="padding: 16px 0; display: flex; gap: 16px;">
                    <button onclick="likePost(${post.id})" style="padding: 10px 20px; background: #fff7ed; color: #d97706; border: 2px solid #d97706; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        ❤️ 좋아요 (${post.likes})
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 32px;">
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px;">💬 댓글 (${comments.length})</h3>
                
                ${user ? `
                    <form onsubmit="handleSubmitComment(event, ${post.id})" style="margin-bottom: 24px;">
                        <textarea name="content" rows="3" placeholder="댓글을 입력하세요" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; resize: vertical; margin-bottom: 8px;"></textarea>
                        <button type="submit" style="padding: 10px 20px; background: linear-gradient(135deg, #d97706, #f59e0b); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">댓글 작성</button>
                    </form>
                ` : '<p style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; color: #6b7280;">댓글을 작성하려면 로그인이 필요합니다.</p>'}
                
                <div id="commentsList">
                    ${comments.length > 0 ? comments.map(comment => `
                        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600; color: #1f2937;">${comment.username}</span>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 0.875rem; color: #6b7280;">${formatDate(comment.created_at)}</span>
                                    ${user && user.id === comment.user_id ? `
                                        <button onclick="deleteComment(${comment.id}, ${post.id})" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">삭제</button>
                                    ` : ''}
                                </div>
                            </div>
                            <p style="color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(comment.content)}</p>
                        </div>
                    `).join('') : '<p style="text-align: center; padding: 32px; color: #6b7280;">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('게시글을 불러올 수 없습니다:', error);
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😢</div>
                <h3>게시글을 불러올 수 없습니다</h3>
            </div>
        `;
    }
}

// 게시글 상세 모달 닫기
function closePostDetailModal() {
    document.getElementById('postDetailModal').style.display = 'none';
}

// 댓글 작성
async function handleSubmitComment(event, postId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        content: formData.get('content')
    };
    
    try {
        const response = await apiRequest(`/api/posts/${postId}/comments`, 'POST', data);
        alert('✅ ' + response.message);
        openPostDetail(postId); // 새로고침
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// 게시글 삭제
async function deletePost(postId) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/posts/${postId}`, 'DELETE');
        alert('✅ ' + response.message);
        closePostDetailModal();
        loadPosts();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// 댓글 삭제
async function deleteComment(commentId, postId) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/comments/${commentId}`, 'DELETE');
        alert('✅ ' + response.message);
        openPostDetail(postId); // 새로고침
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// 좋아요
async function likePost(postId) {
    if (!AuthManager.isLoggedIn()) {
        alert('⚠️ 로그인이 필요합니다!');
        return;
    }
    
    try {
        const response = await apiRequest(`/api/posts/${postId}/like`, 'POST');
        alert('✅ ' + response.message);
        openPostDetail(postId); // 새로고침
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// 유틸리티 함수
function getCategoryIcon(category) {
    const icons = {
        '질문': '💡',
        '정보공유': '📚',
        '성공사례': '🎉',
        '자유': '✨'
    };
    return icons[category] || '📝';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
