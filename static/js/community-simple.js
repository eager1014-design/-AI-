/**
 * 💬 깔끔한 커뮤니티 - 카테고리별 게시판
 */

let currentCategory = 'all';
let allPosts = [];

// 페이지 로드 시 게시글 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupCategoryTabs();
});

/**
 * 카테고리 탭 설정
 */
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 모든 탭 비활성화
            tabs.forEach(t => t.classList.remove('active'));
            // 클릭한 탭 활성화
            tab.classList.add('active');
            
            // 카테고리 변경
            currentCategory = tab.dataset.category;
            filterPosts();
        });
    });
}

/**
 * 게시글 목록 불러오기
 */
async function loadPosts() {
    const postsContainer = document.getElementById('communityPosts');
    
    try {
        const response = await fetch('/api/community/posts');
        
        if (!response.ok) {
            throw new Error('게시글을 불러올 수 없습니다.');
        }
        
        const data = await response.json();
        allPosts = data.posts || [];
        
        filterPosts();
        
    } catch (error) {
        console.error('게시글 로딩 오류:', error);
        postsContainer.innerHTML = '<p class="empty-state">⚠️ 게시글을 불러오는 중 오류가 발생했습니다.</p>';
    }
}

/**
 * 카테고리별 필터링
 */
function filterPosts() {
    const postsContainer = document.getElementById('communityPosts');
    
    let filteredPosts = allPosts;
    
    // 카테고리 필터
    if (currentCategory !== 'all') {
        filteredPosts = allPosts.filter(post => post.category === currentCategory);
    }
    
    // 게시글이 없는 경우
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p class="empty-state">📝 아직 게시글이 없습니다.</p>';
        return;
    }
    
    // 공지사항을 먼저, 그 다음 최신순
    filteredPosts.sort((a, b) => {
        if (a.category === '공지' && b.category !== '공지') return -1;
        if (a.category !== '공지' && b.category === '공지') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });
    
    // 게시글 렌더링
    postsContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
}

/**
 * 게시글 카드 HTML 생성
 */
function createPostCard(post) {
    const imageHtml = post.image_url 
        ? `<img src="${post.image_url}" alt="${post.title}" class="post-image">`
        : `<div class="post-image placeholder">📝</div>`;
    
    const formattedDate = formatDate(post.created_at);
    
    const categoryEmoji = {
        '공지': '📢',
        '질문': '❓',
        '자유': '💬'
    };
    
    return `
        <div class="post-card">
            ${imageHtml}
            <div class="post-body">
                <span class="post-category ${post.category}">${categoryEmoji[post.category] || '💬'} ${post.category}</span>
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <p class="post-content">${escapeHtml(post.content)}</p>
                <div class="post-footer">
                    <div class="post-author">
                        <span class="post-author-icon">👤</span>
                        <span>${escapeHtml(post.author_name || '익명')}</span>
                    </div>
                    <div class="post-date">${formattedDate}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 1분 미만
    if (diff < 60000) {
        return '방금 전';
    }
    
    // 1시간 미만
    if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}분 전`;
    }
    
    // 24시간 미만
    if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}시간 전`;
    }
    
    // 7일 미만
    if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}일 전`;
    }
    
    // 그 외
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
