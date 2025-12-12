# 🤖 JINBUBU AI Market - 고급 AI 기능 API 가이드

## 📋 목차
1. [실시간 감정 분석](#실시간-감정-분석)
2. [개인화 콘텐츠 생성](#개인화-콘텐츠-생성)
3. [실시간 A/B 테스트](#실시간-ab-테스트)
4. [트렌드 분석](#트렌드-분석)
5. [경쟁자 분석](#경쟁자-분석)

---

## 🎯 실시간 감정 분석

텍스트의 감정을 실시간으로 분석하고 콘텐츠 전략을 추천합니다.

### Endpoint
```
POST /api/emotion-realtime
```

### Request Body
```json
{
  "text": "오늘 정말 행복한 하루였어요! 새로운 프로젝트가 성공적으로 완료되어서 너무 기쁩니다."
}
```

### Response
```json
{
  "emotion": "positive",
  "confidence": 0.73,
  "recommendation": {
    "tone": "긍정적이고 활기찬 톤을 유지하세요",
    "content_type": "성공 스토리, 팁 공유, 즐거운 경험",
    "hashtags": ["#긍정에너지", "#행복", "#좋은하루", "#성공스토리"],
    "best_time": "오전 9-11시 (긍정적인 에너지가 높은 시간)"
  },
  "analysis": {
    "text_length": 47,
    "word_count": 10,
    "analyzed_at": "2025-12-12T05:19:00.214667"
  }
}
```

### 감정 분류
- `positive`: 긍정적 감정 (행복, 기쁨, 사랑 등)
- `negative`: 부정적 감정 (슬픔, 화남, 실망 등)
- `neutral`: 중립적 감정

---

## 🎨 개인화 콘텐츠 생성

사용자 데이터 기반으로 최적화된 콘텐츠 전략을 생성합니다.

### Endpoint
```
POST /api/personalized-content
```

### Request Body
```json
{
  "interests": ["AI 프롬프트", "SNS 마케팅"],
  "platform": "instagram",
  "target_audience": "1인 크리에이터"
}
```

### Response
```json
{
  "content": {
    "title": "AI 프롬프트 관련 인스타그램 릴스/피드 콘텐츠",
    "format": {
      "format": "인스타그램 릴스/피드",
      "optimal_length": "30-60초",
      "key_elements": [
        "강력한 첫 3초",
        "비주얼 중심",
        "짧은 자막",
        "해시태그 10-15개"
      ]
    },
    "hook": "'1인 크리에이터'를 위한 강력한 오프닝 멘트",
    "main_points": [
      "AI 프롬프트에 대한 핵심 포인트 1",
      "시청자의 문제 해결 방법",
      "실전에서 바로 쓸 수 있는 팁"
    ],
    "cta": "좋아요, 댓글, 저장 유도 멘트",
    "hashtags": ["#AI프롬프트", "#SNS마케팅"]
  },
  "engagement_prediction": {
    "predicted_likes": 1000,
    "predicted_comments": 150,
    "predicted_shares": 80,
    "engagement_rate": "100.0%",
    "confidence": 0.95
  },
  "optimal_posting_time": {
    "today": "weekday",
    "optimal_times": {
      "morning": "07:00-09:00 (출근 시간)",
      "lunch": "12:00-13:00 (점심 시간)",
      "evening": "18:00-21:00 (퇴근 후)",
      "best": "20:00-21:00"
    },
    "next_best_time": "오늘 저녁 8시",
    "tip": "일관된 게시 시간을 유지하면 알고리즘에 유리합니다."
  }
}
```

### 지원 플랫폼
- `instagram`: 인스타그램 (릴스/피드)
- `youtube`: 유튜브 (쇼츠/영상)
- `tiktok`: 틱톡 (숏폼)
- `blog`: 블로그 (포스트)

---

## 🔬 실시간 A/B 테스트

두 가지 콘텐츠 버전을 비교하고 더 나은 버전을 추천합니다.

### Endpoint
```
POST /api/ab-test-realtime
```

### Request Body
```json
{
  "variant_a": {
    "title": "AI로 10분만에 인스타 콘텐츠 만들기",
    "hashtags": ["#AI", "#인스타그램", "#콘텐츠제작", "#SNS마케팅", "#프롬프트"],
    "cta": "저장하고 따라하기",
    "has_media": true
  },
  "variant_b": {
    "title": "완전 초보도 가능! AI 활용 SNS 콘텐츠 제작 완벽 가이드 (feat. ChatGPT)",
    "hashtags": ["#AI", "#인스타"],
    "cta": "좋아요 누르기",
    "has_media": false
  }
}
```

### Response
```json
{
  "winner": "A",
  "confidence": 0.67,
  "scores": {
    "variant_a": 1.0,
    "variant_b": 0.5
  },
  "next_action": "버전 A를 사용하세요. 예상 성과: 100% 향상",
  "insights": {
    "title_length": {
      "a": 21,
      "b": 50,
      "recommendation": "10-50자가 최적입니다."
    },
    "hashtag_count": {
      "a": 5,
      "b": 2,
      "recommendation": "5-15개가 최적입니다."
    }
  },
  "tested_at": "2025-12-12T05:19:14.175164"
}
```

### 평가 기준
1. **제목 길이**: 10-50자가 최적
2. **해시태그 수**: 5-15개가 최적
3. **CTA 존재**: 명확한 행동 유도 문구
4. **미디어 포함**: 이미지/영상 포함 여부

---

## 📈 트렌드 분석

키워드의 트렌드 점수를 분석하고 전략을 추천합니다.

### Endpoint
```
POST /api/trends/analyze
```

### Request Body
```json
{
  "keyword": "AI프롬프트",
  "platform": "instagram"
}
```

### Response
```json
{
  "keyword": "AI프롬프트",
  "platform": "instagram",
  "trend_score": 16.5,
  "popularity": "낮음",
  "related_hashtags": [
    "#AI프롬프트",
    "#AI프롬프트추천",
    "#AI프롬프트팁",
    "AI프롬프트챌린지"
  ],
  "recommendation": "'AI프롬프트' 키워드는 아직 경쟁이 적습니다. 선점 효과를 노려보세요!"
}
```

---

## 🎯 경쟁자 분석

경쟁자의 콘텐츠 전략을 분석하고 개선점을 제안합니다.

### Endpoint
```
POST /api/competitor/analyze
```

### Request Body
```json
{
  "url": "https://instagram.com/competitor"
}
```

### Response
```json
{
  "competitor": "https://instagram.com/competitor",
  "analysis": {
    "posting_frequency": "주 3-5회",
    "best_performing_content": "숏폼 영상 (30-60초)",
    "average_engagement": "3.5%",
    "peak_posting_times": ["오전 9시", "저녁 8시"],
    "content_themes": ["일상 브이로그", "팁 공유", "챌린지"]
  },
  "recommendations": [
    "경쟁자보다 게시 빈도를 높이세요 (주 5-7회)",
    "숏폼 영상 포맷을 메인으로 사용하세요",
    "참여율이 높은 '팁 공유' 콘텐츠를 늘리세요"
  ]
}
```

---

## 🔐 인증

현재 모든 API는 인증 없이 사용 가능합니다. 향후 JWT 토큰 기반 인증이 추가될 예정입니다.

---

## 💡 사용 예시

### cURL
```bash
# 감정 분석
curl -X POST http://localhost:8003/api/emotion-realtime \
  -H "Content-Type: application/json" \
  -d '{"text":"오늘 너무 행복해요!"}'

# 개인화 콘텐츠
curl -X POST http://localhost:8003/api/personalized-content \
  -H "Content-Type: application/json" \
  -d '{"interests":["AI"],"platform":"instagram","target_audience":"크리에이터"}'
```

### JavaScript (Fetch)
```javascript
// 감정 분석
fetch('/api/emotion-realtime', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '오늘 너무 행복해요!' })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Python (Requests)
```python
import requests

# 감정 분석
response = requests.post(
    'http://localhost:8003/api/emotion-realtime',
    json={'text': '오늘 너무 행복해요!'}
)
print(response.json())
```

---

## 🚀 향후 개선 계획

1. **실제 AI 모델 통합**
   - OpenAI GPT API 연동
   - 감정 분석 ML 모델 적용
   - 트렌드 예측 딥러닝 모델

2. **데이터 수집 및 학습**
   - 사용자 피드백 수집
   - 실제 성과 데이터 분석
   - 모델 지속적 개선

3. **고급 기능 추가**
   - 이미지 분석 API
   - 영상 자동 편집 추천
   - 음성 감정 분석

---

## 📞 문의

- **이메일**: eager1014@gmail.com
- **GitHub**: https://github.com/eager1014-design/-AI-
- **웹사이트**: https://8003-ieqskqqgv5heqsrwn2d81-18e660f9.sandbox.novita.ai

---

© 2024 JINBUBU AI Market. All rights reserved.
