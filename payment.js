// ==================== Toss Payments 결제 처리 ====================

// Toss Payments 클라이언트 키 (테스트용)
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// 결제 위젯 초기화
let paymentWidget = null;

// 구매하기 버튼 클릭 시 Toss Payments 결제 시작
document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');
    
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', async () => {
            // 로그인 확인
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login.html';
                return;
            }
            
            // 현재 선택된 프롬프트 정보 가져오기
            const promptTitle = document.getElementById('modalTitle')?.textContent || '프롬프트';
            const promptPriceText = document.getElementById('modalPrice')?.textContent || '₩0';
            const promptId = purchaseBtn.getAttribute('data-prompt-id') || 'unknown';
            
            // 가격에서 숫자만 추출
            const originalPrice = parseInt(promptPriceText.replace(/[^0-9]/g, '')) || 0;
            
            if (originalPrice === 0) {
                alert('상품 정보를 확인할 수 없습니다.');
                return;
            }
            
            try {
                // 1단계: 결제 준비 API 호출
                const prepareResponse = await fetch('/api/payment/prepare', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        prompt_id: promptId,
                        prompt_title: promptTitle,
                        original_price: originalPrice
                    })
                });
                
                if (!prepareResponse.ok) {
                    throw new Error('결제 준비 실패');
                }
                
                const paymentData = await prepareResponse.json();
                
                // 2단계: Toss Payments SDK로 결제 시작
                const paymentWidget = await loadPaymentWidget(paymentData.toss_client_key);
                
                // 결제 요청
                await paymentWidget.requestPayment({
                    method: "CARD",  // 카드 결제
                    amount: {
                        currency: "KRW",
                        value: paymentData.amount
                    },
                    orderId: paymentData.order_id,
                    orderName: paymentData.order_name,
                    successUrl: window.location.origin + "/payment/success",
                    failUrl: window.location.origin + "/payment/fail",
                    customerEmail: paymentData.customer_email,
                    customerName: paymentData.customer_name
                });
                
            } catch (error) {
                console.error('결제 오류:', error);
                alert('결제 처리 중 오류가 발생했습니다: ' + error.message);
            }
        });
    }
});

// Toss Payments 위젯 로드 함수
async function loadPaymentWidget(clientKey) {
    try {
        const paymentWidget = await window.PaymentWidget(clientKey, window.PaymentWidget.ANONYMOUS);
        return paymentWidget;
    } catch (error) {
        console.error('Toss Payments 위젯 로드 실패:', error);
        throw error;
    }
}

// 모달 열릴 때 프롬프트 ID 저장
window.addEventListener('openPromptModal', (event) => {
    const promptId = event.detail?.promptId;
    const purchaseBtn = document.getElementById('purchaseBtn');
    if (purchaseBtn && promptId) {
        purchaseBtn.setAttribute('data-prompt-id', promptId);
    }
});

console.log('✅ Payment.js 로드 완료 (Toss Payments 연동)');
