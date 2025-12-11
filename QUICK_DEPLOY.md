# ⚡ 빠른 배포 가이드

## 🚀 Railway 배포 (5분 완성)

### 1단계: Railway 가입
```
https://railway.app/
```
→ "Login with GitHub" 클릭

### 2단계: GitHub 저장소 생성
```
https://github.com/new
```
- Repository name: `jjinbubu-ai`
- Public 선택
- "Create repository" 클릭

### 3단계: 코드 푸시
```bash
cd /home/user/webapp
git remote add github https://github.com/YOUR_USERNAME/jjinbubu-ai.git
git push -u github main
```

### 4단계: Railway에 배포
1. Railway 대시보드에서 "New Project"
2. "Deploy from GitHub repo" 선택
3. `jjinbubu-ai` 저장소 선택
4. 자동 배포 시작! (5분 소요)

### 5단계: URL 확인
```
https://YOUR-PROJECT.up.railway.app
```

### 6단계: 커스텀 도메인 (선택)
Settings → Generate Domain → `jjinbubu-ai` 입력
```
https://jjinbubu-ai.railway.app
```

## ✅ 완료!

이제 사이트 주소가 생겼습니다!

---

## 🆘 도움이 필요하면

"Railway 배포 도와줘"라고 말씀해주세요!
