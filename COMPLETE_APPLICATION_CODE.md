# Полный код приложения Content Factory Pro для Netlify

Здесь содержится полный исходный код всех компонентов, функций и API маршрутов для развертывания на Netlify.

## app/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { generateContent, schedulePost } from '@/lib/api';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateContent(prompt);
      setContent(result.content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    try {
      const result = await schedulePost({
        content,
        scheduledAt: new Date().toISOString(),
      });
      setPosts([...posts, result]);
      setContent('');
      setPrompt('');
    } catch (error) {
      console.error('Error scheduling:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Content Factory Pro</h1>
          <p className="text-gray-600">AI-powered content generation and scheduling</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Generate Content</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Введите промпт для генерации контента..."
              className="w-full h-32 p-3 border rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Генерирую...' : 'Генерировать'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Content</h2>
            {content ? (
              <>
                <p className="mb-4 p-3 bg-gray-50 rounded-lg">{content}</p>
                <button
                  onClick={handleSchedule}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Запланировать пост
                </button>
              </>
            ) : (
              <p className="text-gray-500">Генерированный контент будет здесь</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Scheduled Posts ({posts.length})</h2>
          <div className="space-y-3">
            {posts.map((post, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{post.content.substring(0, 100)}...</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(post.scheduledAt).toLocaleString('ru-RU')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## lib/api.ts

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function generateContent(prompt: string) {
  const response = await fetch(`${baseURL}/api/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) throw new Error('Failed to generate content');
  return response.json();
}

export async function schedulePost(postData: any) {
  const response = await fetch(`${baseURL}/api/schedule-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) throw new Error('Failed to schedule post');
  return response.json();
}

export async function getAnalytics() {
  const response = await fetch(`${baseURL}/api/analytics`);
  
  if (!response.ok) throw new Error('Failed to get analytics');
  return response.json();
}
```

## functions/api/generate-content.ts

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');
    
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt required' }) };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content creation expert. Generate engaging, professional content.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to generate content' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: data.choices[0].message.content,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
};

export { handler };
```

## functions/api/schedule-post.ts

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const postData = JSON.parse(event.body || '{}');

    // Validate post data
    if (!postData.content) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Content required' }) };
    }

    // Save to database or Telegram
    const scheduledPost = {
      id: Date.now().toString(),
      ...postData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    // Send to Telegram if configured
    if (process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      await sendToTelegram(postData.content);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        post: scheduledPost,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
};

async function sendToTelegram(content: string) {
  const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: content,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to Telegram');
  }
}

export { handler };
```

## functions/api/analytics.ts

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // Return mock analytics data
    const analytics = {
      totalPosts: 42,
      scheduledPosts: 8,
      publishedPosts: 34,
      engagementRate: 8.5,
      lastUpdated: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(analytics),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch analytics' }),
    };
  }
};

export { handler };
```

## app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  @apply w-full mx-auto px-4 sm:px-6 lg:px-8;
}
```

## Инструкции по использованию кода

1. **app/page.tsx** - поместите в папку `app/`
2. **lib/api.ts** - поместите в папку `lib/`  
3. **functions/api/*.ts** - поместите каждый файл в папку `functions/api/`
4. **app/globals.css** - поместите в папку `app/`

## Запуск локально

```bash
npm install
npm run dev
```

## Развертывание на Netlify

```bash
git add .
git commit -m "Add complete application code"
git push
```

Нетлify автоматически сделает build и develop.
