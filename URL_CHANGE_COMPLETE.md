# 🌐 사이트 주소 변경 완료!

## ✅ **배포 준비 완료**

사이트 주소를 짧고 멋진 URL로 바꿀 수 있도록 모든 파일을 준비했습니다!

---

## 🚀 **현재 상태**

### 현재 URL (개발용)
```
https://8003-ieqskqqgv5heqsrwn2d81-18e660f9.sandbox.novita.ai
```
→ 이건 개발 전용이라 변경 불가능합니다

### 배포 후 URL (짧고 멋진!)
```
https://jjinbubu-ai.railway.app
```
또는
```
https://jjinbubu-ai.onrender.com
```

### 나중에 도메인 구매 시
```
https://jjinbubu-ai.com
https://jjinbubu.shop
https://jjinbubu-prompt.com
```

---

## ⚡ **5분 배포 가이드**

### 🎯 방법 1: Railway (가장 쉬움)

#### 1단계: Railway 가입 (1분)
```
https://railway.app/
```
- "Login with GitHub" 클릭
- GitHub 계정으로 로그인

#### 2단계: 새 프로젝트 (2분)
1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. GitHub 저장소 연결하기

#### 3단계: GitHub 저장소 생성 (필요시)
```
https://github.com/new
```
- Repository name: **jjinbubu-ai**
- Public 선택
- "Create repository" 클릭

#### 4단계: 코드 푸시
```bash
cd /home/user/webapp

# GitHub 저장소 연결
git remote add github https://github.com/YOUR_USERNAME/jjinbubu-ai.git

# 코드 푸시
git push -u github main
```

#### 5단계: Railway에서 배포 (2분)
1. Railway에서 GitHub 저장소 선택
2. 자동으로 배포 시작!
3. 5분 후 완료 ✅

#### 6단계: URL 확인
Railway가 자동으로 URL 생성:
```
https://YOUR-PROJECT.up.railway.app
```

#### 7단계: 커스텀 도메인 (선택)
Railway 대시보드에서:
- **Settings** → **Domains** → **Generate Domain**
- 원하는 이름 입력: `jjinbubu-ai`

**최종 URL**:
```
https://jjinbubu-ai.railway.app
```

---

### 🎯 방법 2: Render (무료 & 쉬움)

#### 1단계: Render 가입
```
https://render.com/
```
- "Get Started" 클릭
- GitHub 계정으로 로그인

#### 2단계: New Web Service
1. **"New +"** 클릭
2. **"Web Service"** 선택
3. GitHub 저장소 연결

#### 3단계: 설정
```
Name: jjinbubu-ai
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

#### 4단계: 배포
- **"Create Web Service"** 클릭
- 10분 후 완료!

**최종 URL**:
```
https://jjinbubu-ai.onrender.com
```

---

## 📋 **준비된 파일 목록**

✅ **requirements.txt** - Python 패키지  
✅ **Procfile** - 서버 실행 명령어  
✅ **railway.json** - Railway 설정  
✅ **runtime.txt** - Python 버전  
✅ **DEPLOY_GUIDE.md** - 상세 가이드  
✅ **QUICK_DEPLOY.md** - 빠른 가이드  

---

## 💡 **배포 옵션 비교**

| 플랫폼 | 무료 | 속도 | 난이도 | URL |
|--------|------|------|--------|-----|
| **Railway** | ✅ 500시간/월 | ⚡ 빠름 | 😊 쉬움 | jjinbubu-ai.railway.app |
| **Render** | ✅ 무료 티어 | 🐢 보통 | 😊 쉬움 | jjinbubu-ai.onrender.com |
| **Vercel** | ✅ 무료 | ⚡⚡ 매우 빠름 | 😐 중간 | jjinbubu-ai.vercel.app |

**추천**: Railway (Flask에 최적화)

---

## 🎓 **단계별 상세 가이드**

### A. GitHub이 처음이신 분

#### 1. GitHub 계정 만들기
```
https://github.com/signup
```

#### 2. 저장소 만들기
- 우측 상단 **"+"** → **"New repository"**
- 이름: `jjinbubu-ai`
- Public 선택
- "Create repository" 클릭

#### 3. 코드 업로드
```bash
cd /home/user/webapp
git remote add github https://github.com/YOUR_USERNAME/jjinbubu-ai.git
git push -u github main
```

---

### B. Railway 배포 (처음 하시는 분)

#### 1. Railway 가입
1. https://railway.app/ 접속
2. "Login with GitHub" 클릭
3. GitHub 계정 승인

#### 2. 프로젝트 생성
1. 대시보드에서 "New Project"
2. "Deploy from GitHub repo" 클릭
3. "Configure GitHub App" (처음만)
4. 저장소 선택: `jjinbubu-ai`

#### 3. 자동 배포
- Railway가 자동으로 감지:
  - ✅ Python 프로젝트
  - ✅ requirements.txt
  - ✅ Procfile
- 5분 후 배포 완료!

#### 4. 환경 변수 설정 (중요!)
Railway 대시보드에서:
- **Variables** 탭 클릭
- 다음 변수 추가:

```bash
PORT=8003
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
```

#### 5. URL 확인
- **Settings** → **Domains**
- 기본 URL 표시됨
- "Generate Domain"으로 커스텀 도메인 생성 가능

---

### C. 도메인 연결 (선택사항)

실제 도메인(예: jjinbubu-ai.com)을 구매한 경우:

#### 1. 도메인 구매 (연간 1~2만원)
- **가비아**: https://www.gabia.com
- **후이즈**: https://www.whois.co.kr

#### 2. Railway에 도메인 추가
1. Railway Settings → Domains
2. "Custom Domain" 클릭
3. 구매한 도메인 입력

#### 3. DNS 설정
도메인 등록 업체에서:
```
Type: CNAME
Name: @
Value: [Railway가 제공하는 주소]
```

#### 4. 완료!
```
https://jjinbubu-ai.com
```

---

## 🔥 **배포 후 할 일**

### 1. 데이터베이스 초기화 확인
- Railway/Render가 자동으로 SQLite 생성
- 관리자 계정 자동 생성됨

### 2. 관리자 로그인 테스트
```
https://jjinbubu-ai.railway.app/admin-login.html

이메일: eager1014@gmail.com
비밀번호: ea787878
```

### 3. 결제 기능 확인
- Toss Payments 테스트 모드 작동 확인
- 나중에 실제 API 키로 교체

### 4. 커뮤니티 기능 테스트
- 모바일 커뮤니티 접속
- 게시글 작성/조회 확인

---

## 🆘 **문제 해결**

### 배포 실패 시
```bash
# Railway 로그 확인
railway logs

# Render 로그 확인
(Render 대시보드에서 Logs 탭)
```

### Port 에러
→ 이미 해결됨 (app.py에서 자동으로 PORT 환경 변수 사용)

### 데이터베이스 에러
→ SQLite는 재시작 시 초기화될 수 있음
→ 나중에 PostgreSQL로 업그레이드 권장

### GitHub 푸시 에러
```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 다시 설정
git remote remove github
git remote add github https://github.com/YOUR_USERNAME/jjinbubu-ai.git
git push -u github main
```

---

## 🎉 **배포 완료 후**

### 최종 URL
```
https://jjinbubu-ai.railway.app
```
또는
```
https://jjinbubu-ai.onrender.com
```

### 사용자에게 공유
- 소모임 링크 업데이트
- SNS에 새 주소 공유
- 마케팅 시작!

---

## 📞 **도움이 필요하시면**

다음 중 하나를 말씀해주세요:

1. **"Railway 배포 도와줘"** → 단계별 안내
2. **"GitHub 저장소 만드는 법"** → 상세 가이드
3. **"도메인 연결하고 싶어"** → DNS 설정 도움
4. **"배포 중 에러 났어"** → 에러 메시지 보내주세요

---

## ✅ **체크리스트**

배포 전:
- [x] requirements.txt 생성
- [x] Procfile 생성
- [x] railway.json 생성
- [x] runtime.txt 생성
- [x] app.py PORT 설정 완료

배포 중:
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시
- [ ] Railway/Render 계정 생성
- [ ] 프로젝트 배포

배포 후:
- [ ] URL 접속 확인
- [ ] 관리자 로그인 테스트
- [ ] 결제 기능 테스트
- [ ] 커뮤니티 확인

---

**지금 바로 시작하세요!** 🚀

1. Railway 가입: https://railway.app/
2. GitHub 저장소 생성
3. 5분 후 새 URL 완성!

**Made with 💕 by 찐부부**
