// 소모임 사진 갤러리 로딩

document.addEventListener('DOMContentLoaded', function() {
    loadPhotoGallery();
});

async function loadPhotoGallery() {
    const photoGallery = document.getElementById('photoGallery');
    
    if (!photoGallery) return;
    
    try {
        // 메인에 표시할 featured 사진만 가져오기
        const response = await fetch('/api/somoim/photos?featured=true&per_page=6');
        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
            renderPhotos(data.photos);
        } else {
            photoGallery.innerHTML = `
                <div class="photo-loading">
                    아직 소모임 활동 사진이 없습니다.<br>
                    곧 멋진 사진들을 공유할 예정입니다! 😊
                </div>
            `;
        }
    } catch (error) {
        console.error('사진 로드 실패:', error);
        photoGallery.innerHTML = `
            <div class="photo-loading">
                사진을 불러올 수 없습니다.<br>
                잠시 후 다시 시도해주세요.
            </div>
        `;
    }
}

function renderPhotos(photos) {
    const photoGallery = document.getElementById('photoGallery');
    
    photoGallery.innerHTML = photos.map(photo => `
        <div class="photo-card" onclick="viewPhoto(${photo.id})">
            <img src="${photo.image_url}" alt="${photo.title}" class="photo-image" 
                 onerror="this.src='https://via.placeholder.com/400x250?text=📸+소모임+활동'">
            <div class="photo-info">
                <div class="photo-title">${escapeHtml(photo.title)}</div>
                ${photo.description ? `<div class="photo-description">${escapeHtml(truncateText(photo.description, 80))}</div>` : ''}
                <div class="photo-meta">
                    <div class="photo-date">
                        📅 ${formatDate(photo.photo_date || photo.created_at)}
                    </div>
                    <div class="photo-stats">
                        <span>❤️ ${photo.likes}</span>
                        <span>👁️ ${photo.views}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function viewPhoto(photoId) {
    // 사진 상세 보기 (나중에 모달로 구현 가능)
    window.location.href = `/community-mobile.html?photo=${photoId}`;
}

function formatDate(dateString) {
    if (!dateString) return '최근';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    
    return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
