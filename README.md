# 🎉 찐부부 AI 프롬프트 마켓플레이스

> 평범한 커플에서 유튜버로 성장한 찐부부의 AI 활용 노하우를 프롬프트로 판매하는 플랫폼

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![Python](https://img.shields.io/badge/Python-3.x-yellow)

## 📋 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [설치 방법](#설치-방법)
- [실행 방법](#실행-방법)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)
- [라이선스](#라이선스)

---

## 🎯 소개

**찐부부 AI 프롬프트 마켓**은 SNS 크리에이터들을 위한 AI 프롬프트 판매 플랫폼입니다.

### 핵심 가치
- 💰 **차등 가격**: 회원 ₩10,000 / 비회원 ₩20,000
- 🎁 **무료 진단**: ChatGPT 활용 능력 무료 진단 제공
- 🎤 **강연 서비스**: AI 시대 크리에이터 성장 전략 강연
- 💕 **찐부부 브랜딩**: 실제 커플 크리에이터의 진정성

---

## ✨ 주요 기능

### 1. 회원 시스템
- ✅ 이메일 기반 회원가입
- ✅ JWT 토큰 인증
- ✅ 회원/비회원 차등 가격
- ✅ 사용자 대시보드

### 2. 프롬프트 카탈로그
1. **ChatGPT 활용 능력 진단** (무료)
2. **SNS 방향성 설계 프롬프트** (₩10,000 / ₩20,000)
3. **콘텐츠 제작 실행 프롬프트** (₩10,000 / ₩20,000)
4. **콘텐츠 아이디어 생성 프롬프트** (₩10,000 / ₩20,000)
5. **SNS 방향성 셀프 진단** (₩10,000 / ₩20,000)

### 3. 구매 시스템
- ✅ 실시간 구매 처리
- ✅ 구매 내역 저장
- ✅ 중복 구매 방지
- ✅ 접근 권한 관리
- 🔒 **프롬프트 보안**: 구매 전 블러 처리 및 복사 방지
  - 미구매 시 150자 미리보기만 제공
  - 블러 효과로 전체 내용 노출 차단
  - 복사 버튼 비활성화 (🔒 구매 후 복사 가능)
  - 구매 완료 시 즉시 전체 프롬프트 표시

### 4. 강연/교육 서비스
- 🎤 **오프라인 강연**: 60분 / 90분 / 120분
- 💻 **온라인 웨비나**: Zoom, Teams
- 🎯 **1:1 컨설팅**: 2시간 집중 세션
- 🏢 **기업 워크샵**: 4시간 ~ 2일 과정

---

## 🛠 기술 스택

### Backend
- **Flask** 3.0.0 - 웹 프레임워크
- **SQLAlchemy** - ORM
- **SQLite** - 데이터베이스
- **PyJWT** - JWT 인증
- **Flask-CORS** - CORS 처리

### Frontend
- **HTML5** / **CSS3** - 마크업 & 스타일
- **JavaScript (Vanilla)** - 클라이언트 로직
- **LocalStorage** - 토큰 저장

### Design
- **반응형 디자인** - 모바일/태블릿/데스크톱
- **그라데이션** - 오렌지/황금색 브랜드 컬러
- **애니메이션** - 호버 효과, 트랜지션

---

## 📦 설치 방법

### 1. 저장소 클론
```bash
git clone <repository-url>
cd webapp
```

### 2. Python 가상환경 생성 (선택)
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. 패키지 설치
```bash
pip install -r requirements.txt
```

---

## 🚀 실행 방법

### 개발 서버 실행
```bash
python3 app.py
```

서버는 `http://localhost:8001`에서 실행됩니다.

### 관리자 대시보드
`http://localhost:8001/admin.html`에서 통계 확인 가능

---

## 🔒 보안 기능

### 프롬프트 콘텐츠 보호
1. **블러 효과 적용**
   - CSS `.blurred` 클래스로 구매 전 프롬프트 흐림 처리
   - `filter: blur(5px)` + 오버레이 메시지로 가독성 차단
   
2. **텍스트 선택 차단**
   - `user-select: none`으로 드래그 선택 불가
   - `pointer-events: none`으로 클릭 이벤트 차단

3. **복사 방지**
   - 구매 전 복사 버튼 비활성화 (`disabled` 속성)
   - 복사 시도 시 경고 알림 표시
   - 버튼 텍스트: "🔒 구매 후 복사 가능"

4. **제한적 미리보기**
   - 전체 프롬프트 중 처음 150자만 표시
   - 나머지 내용은 "[... 이하 생략 ...]"으로 대체
   - 전체 길이 정보 제공으로 구매 유도

5. **구매 후 즉시 잠금 해제**
   - 구매 완료 시 자동으로 모달 리프레시
   - 블러 효과 제거 + 복사 버튼 활성화
   - 전체 프롬프트 내용 표시

---

## 📡 API 문서

### 인증 API

#### POST `/api/register`
회원가입

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "홍길동",
  "password": "password123",
  "is_member": true
}
```

**Response:**
```json
{
  "message": "회원가입이 완료되었습니다!",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "홍길동",
    "is_member": true
  }
}
```

#### POST `/api/login`
로그인

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/user/me`
사용자 정보 조회 (인증 필요)

**Headers:**
```
Authorization: Bearer <token>
```

### 프롬프트 API

#### POST `/api/purchase`
프롬프트 구매 (인증 필요)

**Request Body:**
```json
{
  "prompt_id": 1,
  "prompt_title": "SNS 방향성 설계 프롬프트",
  "price": 10000
}
```

#### GET `/api/purchases`
구매 내역 조회 (인증 필요)

#### GET `/api/check-access/<prompt_id>`
프롬프트 접근 권한 확인 (인증 필요)

### 통계 API

#### GET `/api/stats`
전체 통계 조회

**Response:**
```json
{
  "total_users": 150,
  "total_members": 75,
  "total_purchases": 230,
  "total_revenue": 2300000
}
```

---

## 📁 프로젝트 구조

```
webapp/
├── app.py                 # Flask 백엔드 서버
├── auth.js                # 인증 UI & API 연동
├── script.js              # 메인 JavaScript 로직
├── index.html             # 메인 홈페이지
├── admin.html             # 관리자 대시보드
├── styles.css             # CSS 스타일시트
├── requirements.txt       # Python 패키지
├── .gitignore            # Git 제외 파일
└── instance/
    └── jjinbubu_market.db # SQLite 데이터베이스
```

---

## 🗄 데이터베이스 스키마

### User 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | Integer | PK |
| email | String(120) | 이메일 (unique) |
| username | String(80) | 사용자 이름 |
| password_hash | String(200) | 암호화된 비밀번호 |
| is_member | Boolean | 회원 여부 |
| created_at | DateTime | 가입일 |

### Purchase 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | Integer | PK |
| user_id | Integer | FK (User) |
| prompt_id | Integer | 프롬프트 ID |
| prompt_title | String(200) | 프롬프트 제목 |
| price | Integer | 구매 가격 |
| purchased_at | DateTime | 구매일 |

---

## 💰 비즈니스 모델

### 수익 채널
1. **프롬프트 판매**: ₩39,900 (프로 패키지)
2. **강연 서비스**: 50만원 ~ 800만원
3. **1:1 컨설팅**: 100만원 ~ 200만원

### 예상 수익
- **월 수익 (보수적)**: 460만원
- **월 수익 (적극적)**: 1,100만원
- **연 수익 (적극적)**: 1억 3,200만원

---

## 📞 문의

### 일반 문의
- **이메일**: eager1014@gmail.com
- **인스타그램**: [@us.after.100](https://www.instagram.com/us.after.100/)
- **유튜브**: [@찐부부9499](https://www.youtube.com/@찐부부9499)

### 강연 문의
강연 형식, 일정, 예산 등 협의 가능
- 이메일로 문의: eager1014@gmail.com?subject=강연문의

---

## 📜 라이선스

© 2024 찐부부 AI 프롬프트 마켓플레이스. All rights reserved.

Made with 💕 by 찐부부

---

## 🚧 향후 개발 계획

### Phase 1 (현재)
- ✅ 회원가입/로그인 시스템
- ✅ 프롬프트 구매 시스템
- ✅ 사용자 대시보드

### Phase 2 (다음 단계)
- [ ] 결제 연동 (토스페이먼츠, 카카오페이)
- [ ] 이메일 인증
- [ ] 비밀번호 찾기
- [ ] 소셜 로그인 (Google, Naver)

### Phase 3 (장기)
- [ ] AI API 실시간 실행
- [ ] 커스텀 프롬프트 생성기
- [ ] 구독 모델
- [ ] 모바일 앱

---

## 🎨 브랜드 가이드

### 컬러 팔레트
- **주황색**: `#d97706`
- **황금색**: `#f59e0b`
- **흰색**: `#ffffff`

### 톤 & 매너
- 진솔함, 공감, 친근함
- "평범한 커플 → 유튜버" 성장 스토리
- AI 시대의 대체 불가능한 가치 강조

---

**🚀 지금 바로 시작하세요!**

```bash
python3 app.py
```

그리고 `http://localhost:8001`을 열어보세요! 🎉
