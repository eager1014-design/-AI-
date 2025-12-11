# 🚀 무료 배포 가이드

## ✅ 배포 파일 준비 완료!

다음 파일들이 생성되었습니다:
- ✅ `requirements.txt` - Python 패키지 목록
- ✅ `Procfile` - 서버 실행 명령어
- ✅ `railway.json` - Railway 설정
- ✅ `runtime.txt` - Python 버전

---

## 🎯 **방법 1: Railway (추천)**

### 장점
- ✅ Flask/Python 완벽 지원
- ✅ 무료 500시간/월
- ✅ 자동 HTTPS
- ✅ 커스텀 도메인 무료

### 배포 방법

#### 1단계: Railway 가입
```
https://railway.app/
```
- GitHub 계정으로 로그인

#### 2단계: 새 프로젝트 생성
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 연결 (또는 "Deploy from GitHub" 없이 직접 업로드)

#### 3단계: GitHub에 코드 푸시
```bash
# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/jjinbubu-ai.git
git branch -M main
git push -u origin main
```

#### 4단계: Railway에서 저장소 선택
1. GitHub 저장소 선택
2. 자동으로 배포 시작
3. 5분 후 완료!

#### 5단계: URL 확인
```
https://jjinbubu-ai-production.up.railway.app
```

#### 6단계 (선택): 커스텀 도메인
- Railway 대시보드에서 "Settings" → "Domains"
- 원하는 서브도메인 입력 (예: jjinbubu-ai)
- 최종 URL: `https://jjinbubu-ai.railway.app`

---

## 🎯 **방법 2: Render (쉬움)**

### 장점
- ✅ 매우 쉬움
- ✅ 무료 티어
- ✅ 자동 배포

### 배포 방법

#### 1단계: Render 가입
```
https://render.com/
```
- GitHub 계정으로 로그인

#### 2단계: New Web Service
1. "New +" 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결

#### 3단계: 설정
```
Name: jjinbubu-ai
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

#### 4단계: 배포
- "Create Web Service" 클릭
- 10분 후 완료!

#### 최종 URL
```
https://jjinbubu-ai.onrender.com
```

---

## 🎯 **방법 3: Vercel (정적 사이트만)**

Vercel은 **프론트엔드만** 배포하고, 백엔드는 다른 곳에 배치:

### 1단계: 프론트엔드를 Vercel에
```bash
# HTML/JS/CSS만 배포
vercel --prod
```

### 2단계: 백엔드를 Railway/Render에
```bash
# Flask API를 별도 배포
```

### 3단계: API URL 연결
```javascript
// script.js에서
const API_URL = 'https://jjinbubu-api.railway.app';
```

---

## 📋 **배포 전 체크리스트**

### 필수 작업
- [x] requirements.txt 생성
- [x] Procfile 생성
- [x] railway.json 생성
- [x] runtime.txt 생성

### 배포 후 작업
- [ ] 데이터베이스 초기화 (Railway/Render에서 자동)
- [ ] 관리자 계정 확인
- [ ] Toss Payments API 키 확인
- [ ] 환경 변수 설정 (SECRET_KEY 등)

---

## 🔐 **환경 변수 설정**

Railway/Render에서 다음 환경 변수 추가:

```bash
SECRET_KEY=jjinbubu-secret-key-2024-ai-prompt-market
TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R
SETTLEMENT_BANK=농협
SETTLEMENT_ACCOUNT=3521621346013
SETTLEMENT_HOLDER=천성준
```

---

## 🎉 **배포 완료 후**

### 최종 URL (예시)
```
Railway: https://jjinbubu-ai.railway.app
Render:  https://jjinbubu-ai.onrender.com
Vercel:  https://jjinbubu-ai.vercel.app (프론트엔드만)
```

### 다음 단계
1. ✅ URL 접속 확인
2. ✅ 관리자 로그인 테스트
3. ✅ 결제 기능 테스트
4. ✅ 커뮤니티 기능 확인

---

## 💡 **추천 순서**

1. **Railway 배포** (가장 쉽고 Flask 완벽 지원)
2. 도메인 구매 시 커스텀 도메인 연결
3. Toss Payments 실제 키로 교체
4. 프롬프트 콘텐츠 업로드
5. 마케팅 시작!

---

## 🆘 **문제 해결**

### 배포 실패 시
```bash
# 로그 확인
railway logs

# 또는
render logs
```

### 데이터베이스 에러
- SQLite는 파일 기반이라 Railway/Render에서 재시작 시 초기화됨
- 해결: PostgreSQL 사용 (Railway에서 쉽게 추가 가능)

### 포트 에러
```python
# app.py 마지막에 추가
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8003))
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

## 📞 **도움이 필요하시면**

1. Railway 배포 중 에러 → 에러 메시지 복사해서 알려주세요
2. GitHub 저장소 생성 도움 → 단계별로 안내해드릴게요
3. 커스텀 도메인 연결 → DNS 설정 도와드릴게요

---

**지금 Railway로 배포 시작하시겠어요?**

1. "Railway 배포 도와줘" → 단계별 안내
2. "GitHub 저장소 만드는 법 알려줘" → 가이드 제공
3. "나중에 할게" → OK!

선택해주세요! 😊
