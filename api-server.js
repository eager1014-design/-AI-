import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = 8004;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client with environment variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Command Center API',
    timestamp: new Date().toISOString()
  });
});

// AI Generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, systemPrompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'prompt 필드가 필요합니다.' 
      });
    }

    console.log('🤖 AI 생성 요청:', {
      systemPrompt: systemPrompt?.substring(0, 50) + '...',
      prompt: prompt.substring(0, 100) + '...'
    });

    const completion = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: systemPrompt || 'You are a helpful AI assistant specialized in creating professional AI employees and upgrading prompts.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = completion.choices[0].message.content;
    
    console.log('✅ AI 응답 생성 완료:', result.substring(0, 100) + '...');

    res.json({ 
      success: true,
      result: result,
      model: 'gpt-5'
    });

  } catch (error) {
    console.error('❌ API 오류:', error);
    
    res.status(500).json({ 
      error: 'AI 생성 중 오류가 발생했습니다.',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 AI Command Center API Server`);
  console.log(`📡 포트: ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 API endpoint: http://localhost:${PORT}/api/generate\n`);
});
