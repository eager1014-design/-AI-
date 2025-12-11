# 📤 GitHub 푸시 가이드

## 🎯 지금 해야 할 것

Railway 화면에서 "GitHub Repository"를 선택하셨군요!

이제 코드를 GitHub에 올려야 합니다.

---

## 📋 **단계별 실행**

### 1단계: GitHub 저장소 생성

1. https://github.com/new 접속
2. Repository name: **jjinbubu-ai**
3. Public 선택
4. "Create repository" 클릭

### 2단계: 저장소 URL 복사

생성 후 나오는 URL 복사:
```
https://github.com/YOUR_USERNAME/jjinbubu-ai.git
```

### 3단계: 코드 푸시 (터미널에서 실행)

```bash
cd /home/user/webapp

# GitHub 저장소 연결
git remote add github https://github.com/YOUR_USERNAME/jjinbubu-ai.git

# 코드 푸시
git push -u github main
```

### 4단계: Railway로 돌아가기

Railway 화면에서:
1. "GitHub Repository" 클릭
2. 방금 만든 `jjinbubu-ai` 저장소 선택
3. 자동 배포 시작!

---

## 🚀 **5분 후 완성!**

Railway가 자동으로:
- ✅ 코드 읽기
- ✅ Python 환경 설정
- ✅ 패키지 설치
- ✅ 서버 시작
- ✅ URL 생성

**최종 URL**: `https://jjinbubu-ai.up.railway.app`

---

## 🆘 **GitHub이 처음이신가요?**

### GitHub 계정 만들기
1. https://github.com/signup
2. 이메일, 비밀번호 입력
3. 인증 완료

### 저장소 만들기
1. 우측 상단 "+" → "New repository"
2. 이름: `jjinbubu-ai`
3. Public 선택
4. "Create repository"

---

## 💡 **다른 방법: Railway CLI (고급)**

터미널에서:

```bash
# Railway CLI 설치
npm install -g @railway/cli

# Railway 로그인
railway login

# 프로젝트 초기화
railway init

# 배포
railway up
```

이 방법은 GitHub 없이 바로 배포됩니다!

---

## ✅ **완료 체크리스트**

배포 전:
- [ ] GitHub 계정 있음
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시 완료

배포 중:
- [ ] Railway에서 저장소 선택
- [ ] 자동 배포 시작
- [ ] 로그 확인

배포 후:
- [ ] URL 접속 확인
- [ ] 사이트 작동 확인

---

**지금 GitHub 저장소를 만드세요!**

https://github.com/new

그 다음:
1. 저장소 URL 복사
2. 코드 푸시
3. Railway에서 선택
4. 완료! 🎉
