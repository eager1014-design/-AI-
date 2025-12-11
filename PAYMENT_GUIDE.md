# 💳 결제 시스템 구현 가이드

## 📋 현재 상태

### ✅ 완료된 기능
1. **결제 데이터 모델** (Payment 테이블)
2. **결제 준비 API** (`/api/payment/prepare`)
3. **결제 완료 API** (`/api/payment/complete`)
4. **환불 API** (`/api/payment/refund`)
5. **관리자 결제 내역 조회** (`/api/admin/payments`)

### ⚠️ 필요한 작업
- **실제 PG사 연동** (Toss Payments, KakaoPay, PortOne 등)

---

## 🔧 결제 시스템 구조

### 1. 데이터베이스 모델

```python
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    order_id = db.Column(db.String(100), unique=True)  # 주문번호
    payment_method = db.Column(db.String(50))  # card, kakao, toss
    amount = db.Column(db.Integer)  # 결제 금액
    status = db.Column(db.String(20))  # pending, completed, failed, refunded
    pg_transaction_id = db.Column(db.String(200))  # PG사 거래 ID
    buyer_name = db.Column(db.String(100))
    buyer_email = db.Column(db.String(120))
    buyer_phone = db.Column(db.String(20))
    item_name = db.Column(db.String(200))
    created_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    refunded_at = db.Column(db.DateTime)
```

### 2. 결제 흐름

```
[사용자] 
   ↓ 구매하기 클릭
[프론트엔드] 
   ↓ POST /api/payment/prepare
[백엔드] 주문번호 생성 + Payment 레코드 생성 (pending)
   ↓ order_id, amount 반환
[프론트엔드] PG사 결제 창 호출
   ↓ 사용자 결제
[PG사] 결제 완료 → 콜백
[프론트엔드] 
   ↓ POST /api/payment/complete (pg_transaction_id 포함)
[백엔드] PG사 API로 결제 검증
   ↓ 검증 성공
[백엔드] Payment 상태 → completed
        Purchase 레코드 생성 (프롬프트 접근 권한 부여)
   ↓
[사용자] 프롬프트 접근 가능!
```

---

## 🚀 PG사 연동 방법

### 옵션 1: Toss Payments (추천)

#### 장점
- 한국 최고의 UX
- 간편결제 지원 (토스페이, 카카오페이, 네이버페이)
- 개발자 친화적 API
- 무료 테스트 환경

#### 연동 단계

**1. Toss Payments 가입**
```
https://www.tosspayments.com/
→ 회원가입 → 개발자센터
```

**2. API 키 발급**
```
개발자센터 → API 키 관리
- 클라이언트 키 (Client Key)
- 시크릿 키 (Secret Key)
```

**3. 프론트엔드 SDK 추가 (index.html)**

```html
<script src="https://js.tosspayments.com/v1/payment"></script>
<script>
const clientKey = 'YOUR_CLIENT_KEY';
const tossPayments = TossPayments(clientKey);

// 구매하기 버튼 클릭 시
async function purchaseWithPayment(promptId, promptTitle, price) {
    try {
        // 1. 주문번호 생성
        const prepareRes = await fetch('/api/payment/prepare', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt_id: promptId,
                amount: price,
                item_name: promptTitle,
                payment_method: 'card'
            })
        });
        
        const prepareData = await prepareRes.json();
        const { order_id, amount } = prepareData;
        
        // 2. Toss Payments 결제 창 호출
        await tossPayments.requestPayment('카드', {
            amount: amount,
            orderId: order_id,
            orderName: promptTitle,
            customerName: prepareData.payment.buyer_name,
            customerEmail: prepareData.payment.buyer_email,
            successUrl: window.location.origin + '/payment-success',
            failUrl: window.location.origin + '/payment-fail'
        });
    } catch (error) {
        console.error('결제 오류:', error);
        alert('결제에 실패했습니다: ' + error.message);
    }
}
</script>
```

**4. 결제 성공 페이지 (payment-success.html)**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>결제 완료</title>
</head>
<body>
    <h1>결제 처리 중...</h1>
    <script>
        // URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const paymentKey = urlParams.get('paymentKey');
        const amount = urlParams.get('amount');
        
        // 백엔드로 결제 완료 요청
        fetch('/api/payment/complete', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: orderId,
                pg_transaction_id: paymentKey,
                prompt_id: 1, // TODO: localStorage에서 가져오기
                prompt_title: '프롬프트 제목'
            })
        })
        .then(res => res.json())
        .then(data => {
            alert('✅ 결제가 완료되었습니다!');
            window.location.href = '/';
        })
        .catch(error => {
            alert('❌ 결제 처리에 실패했습니다.');
            window.location.href = '/';
        });
    </script>
</body>
</html>
```

**5. 백엔드 결제 검증 (app.py)**

```python
import requests

def verify_toss_payment(payment_key, order_id, amount):
    """Toss Payments API로 결제 검증"""
    secret_key = 'YOUR_SECRET_KEY'  # 환경 변수로 관리 권장
    
    url = 'https://api.tosspayments.com/v1/payments/confirm'
    headers = {
        'Authorization': f'Basic {base64.b64encode(f"{secret_key}:".encode()).decode()}',
        'Content-Type': 'application/json'
    }
    data = {
        'paymentKey': payment_key,
        'orderId': order_id,
        'amount': amount
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# /api/payment/complete 수정
@app.route('/api/payment/complete', methods=['POST'])
@token_required
def complete_payment(current_user):
    data = request.get_json()
    order_id = data.get('order_id')
    pg_transaction_id = data.get('pg_transaction_id')  # paymentKey
    
    payment = Payment.query.filter_by(order_id=order_id).first()
    
    # Toss Payments 검증
    verify_result = verify_toss_payment(pg_transaction_id, order_id, payment.amount)
    
    if verify_result.get('status') != 'DONE':
        payment.status = 'failed'
        db.session.commit()
        return jsonify({'message': '결제 검증 실패'}), 400
    
    # 결제 완료 처리
    payment.status = 'completed'
    payment.pg_transaction_id = pg_transaction_id
    payment.completed_at = datetime.utcnow()
    
    # Purchase 생성
    purchase = Purchase(
        user_id=current_user.id,
        prompt_id=data['prompt_id'],
        prompt_title=data['prompt_title'],
        price=payment.amount
    )
    db.session.add(purchase)
    db.session.commit()
    
    return jsonify({'message': '결제 완료!'}), 200
```

---

### 옵션 2: KakaoPay

#### 장점
- 카카오톡 간편결제
- 높은 사용자 인지도
- 모바일 최적화

#### 연동 단계

**1. 카카오페이 가입**
```
https://developers.kakao.com/
→ 내 애플리케이션 → 앱 만들기
→ 결제 → Admin Key 확인
```

**2. 프론트엔드 연동**

```javascript
// 결제 준비
async function payWithKakao(orderId, amount, itemName) {
    const response = await fetch('https://kapi.kakao.com/v1/payment/ready', {
        method: 'POST',
        headers: {
            'Authorization': 'KakaoAK YOUR_ADMIN_KEY',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'cid': 'TC0ONETIME',  // 테스트용
            'partner_order_id': orderId,
            'partner_user_id': 'user123',
            'item_name': itemName,
            'quantity': 1,
            'total_amount': amount,
            'tax_free_amount': 0,
            'approval_url': window.location.origin + '/payment-success',
            'cancel_url': window.location.origin + '/payment-cancel',
            'fail_url': window.location.origin + '/payment-fail'
        })
    });
    
    const data = await response.json();
    window.location.href = data.next_redirect_pc_url;  // 결제 페이지로 이동
}
```

---

### 옵션 3: PortOne (구 아임포트)

#### 장점
- 다양한 PG사 통합 (토스, 카카오, 네이버 등)
- 간단한 연동
- 무료 플랜 제공

#### 연동 단계

**1. PortOne SDK 추가**

```html
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>
<script>
const IMP = window.IMP;
IMP.init('YOUR_IMP_CODE');  // 가맹점 식별코드

function payWithPortOne(orderId, amount, name) {
    IMP.request_pay({
        pg: 'tosspayments',  // PG사 선택
        pay_method: 'card',
        merchant_uid: orderId,
        name: name,
        amount: amount,
        buyer_email: 'user@example.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678'
    }, function(response) {
        if (response.success) {
            // 결제 성공 → 백엔드로 검증 요청
            fetch('/api/payment/complete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: response.merchant_uid,
                    pg_transaction_id: response.imp_uid,
                    prompt_id: 1,
                    prompt_title: name
                })
            });
        } else {
            alert('결제 실패: ' + response.error_msg);
        }
    });
}
</script>
```

---

## 📊 비교표

| PG사 | 장점 | 단점 | 수수료 | 추천도 |
|------|------|------|--------|--------|
| **Toss Payments** | 최고의 UX, 간편결제, 개발자 친화적 | - | 2.9% | ⭐⭐⭐⭐⭐ |
| **KakaoPay** | 높은 인지도, 카카오톡 연동 | 카카오 종속성 | 3.0% | ⭐⭐⭐⭐ |
| **PortOne** | 다양한 PG 통합, 간단한 연동 | 중개 수수료 추가 | 3.5% | ⭐⭐⭐⭐ |

---

## 🔐 보안 고려사항

### 1. API 키 관리
```python
# 환경 변수로 관리 (절대 코드에 직접 입력 금지!)
import os
TOSS_CLIENT_KEY = os.environ.get('TOSS_CLIENT_KEY')
TOSS_SECRET_KEY = os.environ.get('TOSS_SECRET_KEY')
```

### 2. 결제 금액 검증
```python
# 프론트엔드에서 받은 금액을 절대 믿지 말 것!
# 서버에서 다시 계산
real_amount = get_prompt_price(prompt_id, user.is_member)
if payment.amount != real_amount:
    return jsonify({'message': '금액 불일치'}), 400
```

### 3. 중복 결제 방지
```python
# 같은 order_id로 이미 완료된 결제가 있는지 확인
existing = Payment.query.filter_by(
    order_id=order_id, 
    status='completed'
).first()

if existing:
    return jsonify({'message': '이미 처리된 결제'}), 400
```

---

## 🧪 테스트 방법

### 1. Toss Payments 테스트 카드
```
카드번호: 1234-5678-1234-5678
유효기간: 12/25
CVC: 123
비밀번호: 12
```

### 2. 테스트 시나리오
1. ✅ 정상 결제
2. ✅ 결제 실패 (잔액 부족)
3. ✅ 결제 취소 (중간에 취소)
4. ✅ 환불 요청
5. ✅ 중복 결제 방지

---

## 💰 현재 사용 가능한 기능

### 관리자 계정
- **이메일**: eager1014@gmail.com
- **비밀번호**: admin1234
- **대시보드**: https://8003-.../admin-dashboard.html

### API 엔드포인트
```
POST /api/payment/prepare        결제 준비 (주문번호 생성)
POST /api/payment/complete       결제 완료 (PG 검증 후 Purchase 생성)
POST /api/payment/{order_id}/refund  환불 처리
GET  /api/admin/payments         전체 결제 내역 (관리자 전용)
```

---

## 📞 다음 단계

### 즉시 구현 가능
1. **Toss Payments 가입** (무료, 5분 소요)
2. **API 키 발급**
3. **프론트엔드 SDK 추가** (위 코드 복사)
4. **백엔드 검증 로직 추가** (10줄 코드)
5. **테스트 결제 실행** ✅

### 필요한 정보
- 사업자등록증 (정식 계약 시)
- 은행 계좌 (정산 받을 계좌)

---

**✨ 찐부부 AI 프롬프트 마켓플레이스**  
_"안전하고 신뢰할 수 있는 결제 시스템"_
