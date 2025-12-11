# 💳 Toss Payments 결제 시스템 가이드

## 📋 개요

찐부부 AI 프롬프트 마켓에 **Toss Payments 결제 시스템**이 완전히 연동되었습니다!

## ✅ 구현 완료 사항

### 1. 백엔드 API
- ✅ `/api/payment/prepare` - 결제 준비 (주문 ID 생성, 할인 적용)
- ✅ `/api/payment/confirm` - 결제 승인 (Toss API 호출)
- ✅ `/payment/success` - 결제 성공 페이지
- ✅ `/payment/fail` - 결제 실패 페이지

### 2. 프론트엔드
- ✅ Toss Payments SDK 연동
- ✅ `payment.js` - 결제 처리 로직
- ✅ 구매하기 버튼 클릭 시 자동 결제 시작
- ✅ 할인율 자동 계산 및 표시

### 3. 데이터베이스
- ✅ `Payment` 모델 - 결제 내역 저장
- ✅ `Purchase` 모델 - 구매 기록 저장
- ✅ 정산 계좌 정보: **농협 3521621346013 (천성준)**

---

## 🔐 현재 모드: **테스트 모드**

### 테스트 API 키
```python
TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'  # 프론트엔드용
TOSS_SECRET_KEY = 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R'  # 백엔드용
```

### 테스트 모드 특징
- ✅ 실제 결제 없이 테스트 가능
- ✅ 결제 플로우 전체 확인 가능
- ✅ 데이터베이스에 기록 저장
- ⚠️ 실제 돈이 빠지지 않음 (테스트 카드 사용)

---

## 💰 결제 플로우

### 1단계: 사용자가 "구매하기" 버튼 클릭
- 로그인 확인
- 프롬프트 ID, 제목, 가격 추출

### 2단계: `/api/payment/prepare` 호출
```javascript
POST /api/payment/prepare
Headers: Authorization: Bearer {token}
Body: {
  prompt_id: "sns-strategy",
  prompt_title: "SNS 성장 전략 프롬프트",
  original_price: 50000
}
```

**응답:**
```json
{
  "order_id": "ORDER_1_sns-strategy_1702345678",
  "order_name": "SNS 성장 전략 프롬프트",
  "customer_name": "홍길동",
  "customer_email": "user@example.com",
  "amount": 25000,  // 50% 할인 적용
  "discount_rate": 50,
  "toss_client_key": "test_ck_...",
  "success_url": "https://yourdomain.com/payment/success",
  "fail_url": "https://yourdomain.com/payment/fail"
}
```

### 3단계: Toss Payments 위젯 호출
```javascript
const paymentWidget = await window.PaymentWidget(clientKey);
await paymentWidget.requestPayment({
  method: "CARD",
  amount: { currency: "KRW", value: 25000 },
  orderId: "ORDER_1_sns-strategy_1702345678",
  orderName: "SNS 성장 전략 프롬프트",
  successUrl: "/payment/success",
  failUrl: "/payment/fail"
});
```

### 4단계: 사용자가 카드 정보 입력 & 결제
- Toss Payments 결제 창 표시
- 테스트 카드 번호 입력 가능
- 결제 승인/거부

### 5단계: 결제 성공 시 `/payment/success`로 리다이렉트
```
URL: /payment/success?paymentKey=xxx&orderId=ORDER_xxx&amount=25000
```

### 6단계: 자동으로 `/api/payment/confirm` 호출
```javascript
POST /api/payment/confirm
Headers: Authorization: Bearer {token}
Body: {
  paymentKey: "xxx",
  orderId: "ORDER_1_sns-strategy_1702345678",
  amount: 25000
}
```

### 7단계: 백엔드에서 Toss API로 결제 승인
```python
POST https://api.tosspayments.com/v1/payments/confirm
Headers: Authorization: Basic {base64(SECRET_KEY:)}
Body: {
  paymentKey: "xxx",
  orderId: "ORDER_xxx",
  amount: 25000
}
```

### 8단계: 데이터베이스에 기록 저장
```python
# Payment 테이블
- order_id: "ORDER_xxx"
- payment_key: "xxx"
- amount: 25000
- status: "DONE"
- approved_at: "2024-12-11 12:34:56"

# Purchase 테이블
- user_id: 1
- prompt_id: "sns-strategy"
- prompt_title: "SNS 성장 전략 프롬프트"
- price: 25000
```

### 9단계: 사용자에게 성공 화면 표시
```
✅ 결제가 완료되었습니다!
구매하신 프롬프트는 마이페이지에서 확인하실 수 있습니다.
```

---

## 🚀 실제 운영 모드로 전환하는 방법

### 1단계: Toss Payments 가입
1. https://www.tosspayments.com/ 방문
2. 회원가입 & 사업자 정보 입력
3. 본인 인증 & 심사 진행 (1~3일 소요)

### 2단계: 실제 API 키 발급
1. Toss Payments 개발자 센터 접속
2. **클라이언트 키** (Client Key) 복사
3. **시크릿 키** (Secret Key) 복사

### 3단계: `app.py` 수정
```python
# 기존 (테스트 키)
app.config['TOSS_CLIENT_KEY'] = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
app.config['TOSS_SECRET_KEY'] = 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R'

# 변경 (실제 키)
app.config['TOSS_CLIENT_KEY'] = 'live_ck_실제키입력'  # 👈 여기 변경
app.config['TOSS_SECRET_KEY'] = 'live_sk_실제키입력'  # 👈 여기 변경
```

### 4단계: `payment.js` 수정
```javascript
// 기존 (테스트 키)
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// 변경 (실제 키)
const TOSS_CLIENT_KEY = 'live_ck_실제키입력';  // 👈 여기 변경
```

### 5단계: 서버 재시작
```bash
cd /home/user/webapp
python3 app.py
```

### 6단계: 실제 결제 테스트
- 실제 카드로 소액 결제 테스트 (예: 1,000원)
- 정산 계좌로 입금 확인 (영업일 기준 2~3일)

---

## 💡 할인 시스템

### 회원 할인율
- **비회원**: 0% (정가)
- **일반 회원**: 30% 할인
- **신규 회원 (가입 3시간 이내)**: 50% 할인 🔥

### 할인 적용 예시
```
원가: ₩50,000
- 비회원: ₩50,000 (할인 없음)
- 일반 회원: ₩35,000 (30% 할인)
- 신규 회원: ₩25,000 (50% 할인)
```

---

## 📊 정산 정보

### 정산 계좌
- **은행**: 농협
- **계좌번호**: 3521621346013
- **예금주**: 천성준

### 정산 주기
- Toss Payments 기본: **월 2회** (15일, 말일)
- 별도 협의 가능: 주 1회 or 실시간 정산

### 수수료
- 카드 결제: **2.9%**
- 간편결제: **2.9%**
- 계좌이체: **1.9%**

---

## 🎯 테스트 방법

### 1. 메인 페이지 접속
```
https://8003-ieqskqqgv5heqsrwn2d81-18e660f9.sandbox.novita.ai
```

### 2. 로그인
- 이메일: `eager1014@gmail.com`
- 비밀번호: `ea787878`

### 3. 프롬프트 카드 클릭
- "SNS 성장 전략 프롬프트" 선택

### 4. "구매하기" 버튼 클릭
- Toss Payments 결제 창 자동 열림

### 5. 테스트 카드 입력
```
카드번호: 1111-2222-3333-4444
유효기간: 12/25
CVC: 123
비밀번호: 아무거나
```

### 6. 결제 완료 확인
- ✅ 성공 페이지로 리다이렉트
- ✅ 데이터베이스에 기록 저장
- ✅ 마이페이지에서 구매 내역 확인

---

## 🔧 문제 해결

### 문제 1: "결제 준비 실패"
**원인**: 로그인 토큰이 만료됨
**해결**: 다시 로그인

### 문제 2: "Toss Payments 위젯 로드 실패"
**원인**: 네트워크 문제 or SDK 로드 오류
**해결**: 페이지 새로고침 (Ctrl + F5)

### 문제 3: "결제 승인 실패"
**원인**: Toss API 호출 오류
**해결**: `server.log` 확인
```bash
tail -f /home/user/webapp/server.log
```

### 문제 4: "금액이 맞지 않습니다"
**원인**: 프론트엔드와 백엔드 금액 불일치
**해결**: 할인율 계산 로직 확인

---

## 📝 추가 기능 (향후 개발)

### 1. 환불 시스템
- 7일 무조건 환불 보장
- `/api/payment/{order_id}/refund` 엔드포인트

### 2. 구독 결제
- 월간 구독: ₩29,000/월
- 연간 구독: ₩290,000/년 (17% 할인)

### 3. 쿠폰 시스템
- 할인 쿠폰 발급
- 추천인 코드

### 4. 결제 내역 조회
- 마이페이지에서 전체 결제 내역
- 영수증 다운로드

---

## 🎉 완료!

**Toss Payments 결제 시스템이 정상적으로 작동합니다!**

테스트 모드에서 충분히 테스트한 후,
실제 API 키로 전환하면 바로 운영 가능합니다.

**문의**: eager1014@gmail.com
