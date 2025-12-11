# 🚀 Render 배포 - 최종 단계

## ✅ 완료된 작업
- [x] 코드 GitHub 푸시 완료
- [x] 담당자 이메일 확인: `eager1014@gmail.com`
- [x] 모든 설정 파일 준비 완료

---

## 📝 Render 계정으로 배포하기

### 🎯 **가장 쉬운 방법 (5분)**

#### 1단계: Render 접속 및 로그인
```
https://render.com/
```

**로그인 방법:**
- "Sign In" 클릭
- "Continue with GitHub" 선택
- GitHub 계정(`eager1014@gmail.com`)으로 로그인

**처음이시면:**
- "Get Started for Free" 클릭
- "Sign Up with GitHub" 선택
- GitHub 계정으로 가입

---

#### 2단계: New Web Service 생성

**로그인 후:**
1. 대시보드 우측 상단 **"New +"** 버튼 클릭
2. **"Web Service"** 선택

---

#### 3단계: GitHub 저장소 연결

**저장소 선택:**
1. "Connect a repository" 화면에서
2. GitHub 계정 연결 허가 (처음 사용 시)
3. 저장소 목록에서 찾기:
   ```
   eager1014-design/-AI-
   ```
4. **"Connect"** 버튼 클릭

**저장소가 안 보이면:**
- "Configure GitHub App" 클릭
- 저장소 접근 권한 부여
- Render로 돌아오기

---

#### 4단계: 서비스 설정

**필수 설정 입력:**

**Name (서비스 이름):**
```
jjinbubu-ai
```

**Region (지역):**
```
Oregon (US West)
```
*또는 가장 가까운 지역 선택*

**Branch (브랜치):**
```
main
```

**Runtime (실행 환경):**
```
Python 3
```
*자동 감지됨*

**Build Command (빌드 명령어):**
```
pip install -r requirements.txt
```

**Start Command (시작 명령어):**
```
gunicorn app:app --bind 0.0.0.0:$PORT
```

---

#### 5단계: 환경 변수 설정

**"Advanced" 섹션 펼치기**

**Environment Variables 추가:**

클릭: **"Add Environment Variable"**

**변수 1:**
```
Key: PORT
Value: 10000
```

**변수 2:**
```
Key: FLASK_ENV
Value: production
```

**변수 3:**
```
Key: SECRET_KEY
Value: jjinbubu-secret-key-2024-ai-prompt-market
```

**변수 4 (선택):**
```
Key: PYTHON_VERSION
Value: 3.11.0
```

---

#### 6단계: 플랜 선택

**Instance Type:**
```
Free
```
*무료 플랜 선택*

**특징:**
- ✅ 무료
- ✅ 750시간/월
- ✅ 자동 HTTPS
- ✅ 충분한 성능

---

#### 7단계: 배포 시작

**"Create Web Service" 버튼 클릭**

**배포 진행 과정:**
```
1. Building... (2-5분)
   - Python 설치
   - 패키지 설치
   - 환경 설정

2. Starting... (1-2분)
   - 서버 시작
   - 헬스 체크

3. Live! (완료)
   - 사이트 접속 가능
```

---

#### 8단계: URL 확인

**배포 완료 후:**

**대시보드에서 URL 찾기:**
```
https://jjinbubu-ai.onrender.com
```

또는 자동 생성된 URL:
```
https://jjinbubu-ai-XXXX.onrender.com
```

**URL 위치:**
- 서비스 대시보드 상단
- 또는 Settings → Domains 섹션

---

## 🎉 배포 완료!

### 최종 확인 사항

**사이트 접속:**
```
https://jjinbubu-ai.onrender.com
```

**테스트 항목:**
1. ✅ 메인 페이지 로딩
2. ✅ 로그인 기능
3. ✅ 프롬프트 목록
4. ✅ 결제 시스템
5. ✅ 대시보드

**관리자 로그인:**
```
URL: https://jjinbubu-ai.onrender.com/admin-login.html
이메일: eager1014@gmail.com
비밀번호: ea787878
```

---

## 🔧 트러블슈팅

### ❌ 빌드 실패 시

**로그 확인:**
1. 대시보드 → Logs 탭
2. 에러 메시지 확인

**흔한 원인:**
- Python 버전 불일치 → `runtime.txt` 확인
- 패키지 설치 실패 → `requirements.txt` 확인
- gunicorn 누락 → requirements.txt에 추가

**해결 방법:**
```bash
# requirements.txt에 gunicorn 추가
echo "gunicorn==21.2.0" >> requirements.txt
git add requirements.txt
git commit -m "Add gunicorn to requirements"
git push origin main
```

Render에서 자동으로 재배포됨

---

### ❌ 서버 시작 실패 시

**Start Command 확인:**
```
gunicorn app:app --bind 0.0.0.0:$PORT
```

**포트 확인:**
```python
# app.py 하단
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8003))
    app.run(host='0.0.0.0', port=port, debug=False)
```

**환경 변수 확인:**
- Settings → Environment
- PORT, FLASK_ENV, SECRET_KEY 모두 설정됨

---

### ❌ 503 Service Unavailable

**원인:**
- 서버가 아직 시작 중
- 헬스 체크 실패

**해결:**
- 5-10분 기다리기
- Logs에서 "Listening on 0.0.0.0:10000" 확인
- Manual Deploy 클릭하여 재배포

---

### ❌ 데이터베이스 초기화 안 됨

**해결:**
Render Shell에서:
```bash
# Render 대시보드 → Shell 탭
python3
>>> from app import db, init_db
>>> init_db()
>>> exit()
```

---

## 🎁 추가 설정 (선택)

### 커스텀 도메인 연결

**무료 도메인 예시:**
```
https://jjinbubu-ai.onrender.com
```

**커스텀 도메인 (도메인 구매 필요):**
1. Settings → Custom Domains
2. "Add Custom Domain"
3. 도메인 입력: `jjinbubu-ai.com`
4. DNS 설정 (가이드 제공됨)

---

### 자동 배포 설정

**GitHub 푸시 시 자동 배포:**
- Settings → Build & Deploy
- "Auto-Deploy" 활성화 (기본값)

**이제 코드 수정 후:**
```bash
git add .
git commit -m "Update"
git push origin main
```
→ Render에서 자동으로 재배포됨! 🎉

---

## 📊 모니터링

### Logs 확인
- Dashboard → Logs 탭
- 실시간 서버 로그 확인

### Metrics 확인
- Dashboard → Metrics 탭
- CPU, 메모리, 네트워크 사용량

### Events 확인
- Dashboard → Events 탭
- 배포 이력, 재시작 이력

---

## 🎯 성공 확인

**체크리스트:**
- [ ] Render 계정 생성/로그인
- [ ] GitHub 저장소 연결
- [ ] 서비스 설정 완료
- [ ] 환경 변수 입력
- [ ] 배포 시작
- [ ] "Live" 상태 확인
- [ ] URL 접속 테스트
- [ ] 로그인 테스트
- [ ] 결제 기능 테스트

---

## 📞 도움이 필요하신가요?

**스크린샷 보내주세요:**
1. 에러 메시지
2. 로그 화면
3. 설정 화면

**또는 다음 정보:**
1. 어느 단계에서 막히셨나요?
2. 어떤 에러가 나왔나요?
3. Render 계정은 만드셨나요?

---

## 🚀 최종 결과

**배포 완료 후:**
```
사이트 URL: https://jjinbubu-ai.onrender.com
관리자: https://jjinbubu-ai.onrender.com/admin-login.html
대시보드: https://jjinbubu-ai.onrender.com/dashboard.html
마이페이지: https://jjinbubu-ai.onrender.com/mypage.html
```

**완성! 🎉**

---

**지금 시작하세요:** https://render.com/

**5분이면 완료됩니다!** 😊
