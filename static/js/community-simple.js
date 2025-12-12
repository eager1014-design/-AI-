/**
 * 💬 깔끔한 커뮤니티 - 간단한 읽기 전용 게시판
 */

// 페이지 로드 시 게시글 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

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
        const posts = data.posts || [];
        
        // 게시글이 없는 경우
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="empty-state">📝 아직 게시글이 없습니다.</p>';
            return;
        }
        
        // 게시글 렌더링
        postsContainer.innerHTML = posts.map(post => createPostCard(post)).join('');
        
    } catch (error) {
        console.error('게시글 로딩 오류:', error);
        postsContainer.innerHTML = '<p class="empty-state">⚠️ 게시글을 불러오는 중 오류가 발생했습니다.</p>';
    }
}

/**
 * 게시글 카드 HTML 생성
 */
function createPostCard(post) {
    const imageHtml = post.image_url 
        ? `<img src="${post.image_url}" alt="${post.title}" class="post-image">`
        : `<div class="post-image placeholder">📝</div>`;
    
    const formattedDate = formatDate(post.created_at);
    
    return `
        <div class="post-card">
            ${imageHtml}
            <div class="post-body">
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
