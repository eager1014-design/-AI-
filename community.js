// 💬 찐부부 커뮤니티 - 게시글 관리

// 전역 변수
let currentEditingPostId = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    initCommunityEvents();
    checkAdminStatus();
});

// 로그인 상태 확인 (필요없음 - 심플 버전)
function checkAdminStatus() {
    // 심플 버전: 아무 것도 하지 않음
}

// 이벤트 초기화
function initCommunityEvents() {
    // 심플 버전: 글쓰기 버튼 없음
    
    // 모달 닫기
    const modalClose = document.getElementById('modalClose');
    const btnCancel = document.getElementById('btnCancel');
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    
    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('communityModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // 폼 제출
    const btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleSubmit);
    }
}

// 게시글 목록 로드
async function loadPosts() {
    const postsContainer = document.getElementById('communityPosts');
    
    try {
        const response = await fetch('/api/community/posts');
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
            postsContainer.innerHTML = data.posts.map(post => renderPost(post)).join('');
            
            // 삭제 버튼 이벤트 추가
            document.querySelectorAll('.post-delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = this.dataset.postId;
                    deletePost(postId);
                });
            });
            
            // 수정 버튼 이벤트 추가
            document.querySelectorAll('.post-edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = this.dataset.postId;
                    editPost(postId);
                });
            });
        } else {
            postsContainer.innerHTML = `
                <div class="posts-empty">
                    <div class="posts-empty-icon">📝</div>
                    <p class="posts-empty-text">아직 게시글이 없습니다.</p>
                    <p style="font-size: 0.875rem; color: #9ca3af;">첫 번째 글을 작성해보세요!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('게시글 로드 실패:', error);
        postsContainer.innerHTML = `
            <div class="posts-empty">
                <div class="posts-empty-icon">⚠️</div>
                <p class="posts-empty-text">게시글을 불러오는데 실패했습니다.</p>
            </div>
        `;
    }
}

// 게시글 렌더링 (심플 버전 - 버튼 없음)
function renderPost(post) {
    const date = new Date(post.created_at);
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    
    // 이미지 표시
    const imageHtml = post.image_url ? `
        <div class="post-image-wrapper">
            <img src="${post.image_url}" alt="게시글 이미지" class="post-image" />
        </div>
    ` : '';
    
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <span class="post-badge">📢 공지</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            ${imageHtml}
            <p class="post-content">${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
            <div class="post-meta">
                <span class="post-author">
                    👤 찐부부
                </span>
                <span class="post-date">
                    📅 ${formattedDate}
                </span>
            </div>
        </div>
    `;
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 모달 열기
function openModal(postData = null) {
    const modal = document.getElementById('communityModal');
    const modalTitle = document.getElementById('modalTitle');
    const postTitle = document.getElementById('postTitle');
    const postContent = document.getElementById('postContent');
    const postId = document.getElementById('postId');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (postData) {
        // 수정 모드
        modalTitle.textContent = '✏️ 글 수정하기';
        postTitle.value = postData.title;
        postContent.value = postData.content;
        postId.value = postData.id;
        btnSubmit.textContent = '수정하기';
        currentEditingPostId = postData.id;
    } else {
        // 새 글 모드
        modalTitle.textContent = '✍️ 새 글 쓰기';
        postTitle.value = '';
        postContent.value = '';
        postId.value = '';
        btnSubmit.textContent = '작성하기';
        currentEditingPostId = null;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('communityModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // 폼 초기화
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postId').value = '';
    currentEditingPostId = null;
}

// 게시글 작성/수정
async function handleSubmit() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = '처리 중...';
    
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const url = currentEditingPostId 
            ? `/api/community/posts/${currentEditingPostId}`
            : '/api/community/posts';
        
        const method = currentEditingPostId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(currentEditingPostId ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다! 💬');
            closeModal();
            loadPosts();
        } else {
            alert(data.error || '오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('게시글 작성/수정 실패:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = currentEditingPostId ? '수정하기' : '작성하기';
    }
}

// 게시글 수정
async function editPost(postId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch(`/api/community/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            openModal(data.post);
        } else {
            alert(data.error || '게시글을 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('게시글 로드 실패:', error);
        alert('오류가 발생했습니다.');
    }
}

// 게시글 삭제
async function deletePost(postId) {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch(`/api/community/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('게시글이 삭제되었습니다.');
            loadPosts();
        } else {
            alert(data.error || '삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('오류가 발생했습니다.');
    }
}
