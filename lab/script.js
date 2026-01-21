// 퍼널 아키텍트 AI - 고급 인터랙티브 JavaScript

// ===== 글로벌 변수 =====
let mouseX = 0, mouseY = 0;
let cursorFollowerX = 0, cursorFollowerY = 0;
let cursorGlowX = 0, cursorGlowY = 0;

// ===== 커서 팔로워 & 글로우 =====
const cursorFollower = document.querySelector('.cursor-follower');
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // 부드러운 팔로워
    cursorFollowerX += (mouseX - cursorFollowerX) * 0.2;
    cursorFollowerY += (mouseY - cursorFollowerY) * 0.2;
    
    // 더 부드러운 글로우
    cursorGlowX += (mouseX - cursorGlowX) * 0.05;
    cursorGlowY += (mouseY - cursorGlowY) * 0.05;
    
    if (cursorFollower) {
        cursorFollower.style.transform = `translate(${cursorFollowerX - 10}px, ${cursorFollowerY - 10}px)`;
    }
    
    if (cursorGlow) {
        cursorGlow.style.transform = `translate(${cursorGlowX - 150}px, ${cursorGlowY - 150}px)`;
    }
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// 링크 호버 시 커서 확대
document.querySelectorAll('a, button, .process-card, .resonance-card-luxury').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorFollower) {
            cursorFollower.style.transform += ' scale(2)';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        if (cursorFollower) {
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(2)', '');
        }
    });
});

// ===== 고급 파티클 시스템 =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = Math.random() * 0.5 + 0.2;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.hue = Math.random() * 60 + 220; // 파란색~보라색
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 마우스와의 상호작용
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
            
            // 화면 밖으로 나가면 리셋
            if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.fill();
            
            // 글로우 효과
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 70%, 60%, 0.8)`;
        }
    }
    
    // 파티클 생성
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
    
    // 파티클 연결선
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ===== 비디오 컨트롤 =====
const heroVideo = document.getElementById('heroVideo');
const videoPlayBtn = document.getElementById('videoPlayBtn');

if (videoPlayBtn && heroVideo) {
    videoPlayBtn.addEventListener('click', () => {
        heroVideo.play();
        videoPlayBtn.classList.add('hidden');
    });
    
    heroVideo.addEventListener('play', () => {
        videoPlayBtn.classList.add('hidden');
    });
    
    heroVideo.addEventListener('pause', () => {
        videoPlayBtn.classList.remove('hidden');
    });
    
    heroVideo.addEventListener('ended', () => {
        videoPlayBtn.classList.remove('hidden');
        
        // 비디오 종료 후 다음 섹션으로 스크롤
        setTimeout(() => {
            document.getElementById('membership').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });
}

// ===== 네비게이션 스크롤 효과 =====
const nav = document.querySelector('.luxury-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== 스크롤 애니메이션 (AOS) =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== 숫자 카운터 애니메이션 =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// 숫자 카드 관찰
const proofCards = document.querySelectorAll('.proof-card');
const proofObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.proof-number');
            if (number && number.getAttribute('data-count')) {
                animateCounter(number);
                proofObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

proofCards.forEach(card => proofObserver.observe(card));

// ===== 3D 카드 효과 (마우스 추적) =====
document.querySelectorAll('.resonance-card-luxury').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `
            translateY(-15px) 
            scale(1.05) 
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ===== 프로세스 카드 3D 효과 =====
document.querySelectorAll('.process-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            translateY(-15px) 
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ===== 스무스 스크롤 (네비게이션 링크) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== 스크롤 인디케이터 숨기기 =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ===== 버튼 리플 효과 =====
document.querySelectorAll('.btn-luxury-primary, .btn-luxury-glow, .btn-luxury-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 리플 스타일 동적 추가
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== 섹션 페이드인 효과 =====
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// ===== 페이지 로드 애니메이션 =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// ===== 마우스 속도에 따른 파티클 생성 =====
let lastMouseX = 0;
let lastMouseY = 0;

setInterval(() => {
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    if (speed > 10 && cursorGlow) {
        cursorGlow.style.filter = `blur(${Math.min(speed, 60)}px)`;
    } else if (cursorGlow) {
        cursorGlow.style.filter = 'blur(40px)';
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}, 50);

// ===== 비디오 자동 재생 (뷰포트 진입 시) =====
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && heroVideo) {
            // 모바일에서는 자동 재생 안 함
            if (window.innerWidth > 768) {
                heroVideo.play().catch(() => {
                    // 자동 재생 실패 시 플레이 버튼 표시
                    if (videoPlayBtn) {
                        videoPlayBtn.classList.remove('hidden');
                    }
                });
            }
        }
    });
}, { threshold: 0.5 });

if (heroVideo) {
    videoObserver.observe(heroVideo);
}

// ===== 콘솔 메시지 =====
console.log('%c퍼널 아키텍트 AI 실험실', 'font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%c실패를 데이터로 해독하는 실험실', 'font-size: 16px; color: #a0a0a0;');
console.log('%c당신의 구조를 바꿀 준비가 되셨나요?', 'font-size: 14px; color: #f093fb;');
console.log('');
console.log('📊 해독된 실패 데이터: 7,429개');
console.log('📈 구조 변경 후 성장률: 87%');
console.log('⏱️ 평균 변화 시작 시점: 30일');
console.log('👥 현재 실험 참여자: 1,247명');
console.log('');
console.log('🚀 회원제 가입하기: /membership-guide.html');
console.log('💬 오픈카톡 입장하기: https://open.kakao.com/o/pJGO9L9h');

// ===== 실시간 참여자 수 랜덤 증가 =====
setInterval(() => {
    const proofNumbers = document.querySelectorAll('.proof-number');
    proofNumbers.forEach(num => {
        if (num.getAttribute('data-count') === '1247') {
            const current = parseInt(num.textContent.replace(/,/g, ''));
            if (Math.random() > 0.7) {
                num.textContent = (current + 1).toLocaleString();
            }
        }
    });
}, 10000);

// ===== 모바일 터치 대응 =====
if ('ontouchstart' in window) {
    // 모바일에서는 커서 효과 숨기기
    if (cursorFollower) cursorFollower.style.display = 'none';
    if (cursorGlow) cursorGlow.style.display = 'none';
}

// ===== 스크롤 진행 바 (선택사항) =====
const createScrollProgress = () => {
    const progress = document.createElement('div');
    progress.style.position = 'fixed';
    progress.style.top = '0';
    progress.style.left = '0';
    progress.style.height = '3px';
    progress.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
    progress.style.zIndex = '10000';
    progress.style.transition = 'width 0.1s ease';
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = scrollPercentage + '%';
    });
};

createScrollProgress();
