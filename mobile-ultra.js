// 🚀 모바일 울트라 최적화 스크립트

(function() {
    'use strict';
    
    // ===== 모바일 감지 =====
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // PC면 실행 안 함
    
    // ===== DOM 로드 완료 후 실행 =====
    document.addEventListener('DOMContentLoaded', function() {
        initMobileEnhancements();
    });
    
    function initMobileEnhancements() {
        createMobileUI();
        setupGestures();
        setupSmoothScroll();
        setupLazyLoading();
        setupPullToRefresh();
        setupHapticFeedback();
    }
    
    // ===== 모바일 UI 생성 =====
    function createMobileUI() {
        // 햄버거 메뉴 생성
        createHamburgerMenu();
        
        // 하단 네비게이션 생성
        createBottomNav();
        
        // FAB 버튼 생성
        createFAB();
        
        // 풀스크린 메뉴 생성
        createFullscreenMenu();
    }
    
    // ===== 햄버거 메뉴 =====
    function createHamburgerMenu() {
        const hamburger = document.createElement('div');
        hamburger.className = 'mobile-hamburger';
        hamburger.innerHTML = `
            <div class="hamburger-icon">
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
            </div>
        `;
        
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            const menu = document.querySelector('.mobile-fullscreen-menu');
            if (menu) {
                menu.classList.toggle('active');
                document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
            }
        });
        
        document.body.appendChild(hamburger);
    }
    
    // ===== 풀스크린 메뉴 =====
    function createFullscreenMenu() {
        const user = AuthManager.getUser();
        const isLoggedIn = AuthManager.isLoggedIn();
        
        const menu = document.createElement('div');
        menu.className = 'mobile-fullscreen-menu';
        
        let userSection = '';
        if (isLoggedIn && user) {
            userSection = `
                <div class="menu-user-info">
                    <div class="user-avatar">👤</div>
                    <div class="user-name">${user.name || '사용자'}</div>
                    <div class="user-email">${user.email}</div>
                    <span class="user-badge">💎 회원</span>
                </div>
            `;
        }
        
        menu.innerHTML = `
            <div class="menu-header">
                <div class="menu-logo">🤖</div>
                <div class="menu-title">JINBUBU AI Market</div>
                <div class="menu-subtitle">AI를 잘 쓰는 사람이 승리합니다</div>
            </div>
            
            ${userSection}
            
            <div class="menu-items">
                <a href="/" class="menu-item">
                    <div class="menu-item-icon">🏠</div>
                    <div class="menu-item-text">
                        홈
                        <span class="menu-item-label">메인 페이지</span>
                    </div>
                    <div class="menu-item-arrow">→</div>
                </a>
                
                <a href="/blog.html" class="menu-item">
                    <div class="menu-item-icon">📚</div>
                    <div class="menu-item-text">
                        블로그
                        <span class="menu-item-label">30대 인사이트 & AI 활용 팁</span>
                    </div>
                    <div class="menu-item-arrow">→</div>
                </a>
                
                <a href="/prompts.html" class="menu-item">
                    <div class="menu-item-icon">💡</div>
                    <div class="menu-item-text">
                        프롬프트 마켓
                        <span class="menu-item-label">검증된 프롬프트 둘러보기</span>
                    </div>
                    <div class="menu-item-arrow">→</div>
                </a>
                

            </div>
            
            <div class="menu-actions">
                ${isLoggedIn ? `
                    <button class="menu-action-btn" onclick="showUserDashboard()">
                        <div class="menu-action-icon">📊</div>
                        대시보드
                    </button>
                    <button class="menu-action-btn" onclick="showEditProfileModal()">
                        <div class="menu-action-icon">⚙️</div>
                        설정
                    </button>
                    <button class="menu-action-btn" onclick="AuthManager.logout()">
                        <div class="menu-action-icon">🚪</div>
                        로그아웃
                    </button>
                    <a href="https://www.somoim.co.kr/8cafe332-cbff-11ef-b613-0a50aa12fbb11" target="_blank" class="menu-action-btn">
                        <div class="menu-action-icon">👥</div>
                        커뮤니티
                    </a>
                ` : `
                    <button class="menu-action-btn" onclick="showLoginModal()">
                        <div class="menu-action-icon">🔐</div>
                        로그인
                    </button>
                    <button class="menu-action-btn" onclick="showRegisterModal()">
                        <div class="menu-action-icon">✨</div>
                        회원가입
                    </button>
                    <a href="https://www.somoim.co.kr/8cafe332-cbff-11ef-b613-0a50aa12fbb11" target="_blank" class="menu-action-btn">
                        <div class="menu-action-icon">👥</div>
                        커뮤니티
                    </a>
                    <a href="https://www.youtube.com/@찐부부9499" target="_blank" class="menu-action-btn">
                        <div class="menu-action-icon">📺</div>
                        유튜브
                    </a>
                `}
            </div>
        `;
        
        document.body.appendChild(menu);
    }
    
    // ===== 하단 네비게이션 =====
    function createBottomNav() {
        const currentPath = window.location.pathname;
        
        const nav = document.createElement('div');
        nav.className = 'mobile-bottom-nav';
        nav.innerHTML = `
            <a href="/" class="bottom-nav-item ${currentPath === '/' ? 'active' : ''}">
                <div class="bottom-nav-icon">🏠</div>
                <div class="bottom-nav-label">홈</div>
            </a>
            <a href="/blog.html" class="bottom-nav-item ${currentPath.includes('/blog') ? 'active' : ''}">
                <div class="bottom-nav-icon">📚</div>
                <div class="bottom-nav-label">블로그</div>
            </a>
            <a href="/prompts.html" class="bottom-nav-item ${currentPath.includes('/prompts') ? 'active' : ''}">
                <div class="bottom-nav-icon">💡</div>
                <div class="bottom-nav-label">프롬프트</div>
                ${getPromptBadge()}
            </a>

        `;
        
        document.body.appendChild(nav);
    }
    
    function getPromptBadge() {
        // 신규 프롬프트 개수 표시 (예시)
        const newCount = 3;
        return newCount > 0 ? `<div class="bottom-nav-badge">${newCount}</div>` : '';
    }
    
    // ===== FAB 버튼 =====
    function createFAB() {
        const fab = document.createElement('button');
        fab.className = 'mobile-fab';
        fab.innerHTML = '💬';
        fab.title = '문의하기';
        
        fab.addEventListener('click', function() {
            window.open('https://www.somoim.co.kr/8cafe332-cbff-11ef-b613-0a50aa12fbb11', '_blank');
        });
        
        document.body.appendChild(fab);
    }
    
    // ===== 제스처 설정 =====
    function setupGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // 스와이프 제스처
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            const menu = document.querySelector('.mobile-fullscreen-menu');
            const hamburger = document.querySelector('.mobile-hamburger');
            
            // 오른쪽 스와이프로 메뉴 열기
            if (swipeDistance > 100 && touchStartX < 50) {
                if (menu && hamburger) {
                    menu.classList.add('active');
                    hamburger.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
            
            // 왼쪽 스와이프로 메뉴 닫기
            if (swipeDistance < -100 && menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    // ===== 부드러운 스크롤 =====
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ===== 지연 로딩 =====
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== Pull to Refresh =====
    function setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        
        document.addEventListener('touchstart', function(e) {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                pulling = true;
            }
        });
        
        document.addEventListener('touchmove', function(e) {
            if (!pulling) return;
            currentY = e.touches[0].pageY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 80) {
                // 새로고침 트리거
                showToast('🔄 페이지를 새로고침합니다...');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                pulling = false;
            }
        });
        
        document.addEventListener('touchend', function() {
            pulling = false;
        });
    }
    
    // ===== 햅틱 피드백 (지원되는 경우) =====
    function setupHapticFeedback() {
        const buttons = document.querySelectorAll('button, .btn, a.menu-item, .bottom-nav-item');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (navigator.vibrate) {
                    navigator.vibrate(10); // 10ms 진동
                }
            });
        });
    }
    
    // ===== 토스트 알림 =====
    window.showToast = function(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };
    
    // ===== 스크롤 애니메이션 =====
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.prompt-card, .stat-item, .importance-card').forEach(el => {
        animateOnScroll.observe(el);
    });
    
    // ===== 모바일 헤더 숨김/표시 (스크롤) =====
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 스크롤 다운 - 헤더 숨기기
                header.style.transform = 'translateY(-100%)';
            } else {
                // 스크롤 업 - 헤더 보이기
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ===== 스와이프 가능한 카드 리스트 =====
    window.createSwipeableCards = function(containerId, cards) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.className = 'swipeable-container';
        container.innerHTML = cards.map(card => `
            <div class="swipeable-card">
                <div style="font-size: 2.5rem; margin-bottom: 12px;">${card.icon}</div>
                <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 8px;">${card.title}</h3>
                <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.5;">${card.description}</p>
            </div>
        `).join('');
        
        // 스와이프 인디케이터 추가
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        indicator.innerHTML = '← 좌우로 스와이프하세요 <span class="swipe-arrow">→</span>';
        container.parentElement.insertBefore(indicator, container.nextSibling);
    };
    
    // ===== 아코디언 =====
    window.setupAccordions = function() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content) {
                    content.classList.toggle('active');
                }
            });
        });
    };
    
    // ===== 모바일 로딩 오버레이 =====
    window.showMobileLoading = function(message = '로딩 중...') {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-loading-overlay';
        overlay.id = 'mobileLoadingOverlay';
        overlay.innerHTML = `
            <div class="loading-logo">🤖</div>
            <div class="loading-text">${message}</div>
        `;
        document.body.appendChild(overlay);
    };
    
    window.hideMobileLoading = function() {
        const overlay = document.getElementById('mobileLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    };
    
    console.log('✅ Mobile Ultra enhancements loaded!');
})();
