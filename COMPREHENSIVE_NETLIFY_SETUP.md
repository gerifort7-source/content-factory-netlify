# Content Factory Pro - Netlify Version
## Complete Setup and Deployment Guide

Этот документ содержит полную информацию о структуре проекта и коде приложения для развертывания на Netlify.

## Структура проекта

```
content-factory-netlify/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── editor/
│   │   └── page.tsx
│   └── schedule/
│       └── page.tsx
├── lib/
│   ├── api.ts
│   ├── store.ts
│   └── utils.ts
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ContentForm.tsx
│   └── AnalyticsCard.tsx
├── functions/
│   ├── api/
│   │   ├── generate-content.ts
│   │   ├── schedule-post.ts
│   │   ├── telegram-webhook.ts
│   │   └── analytics.ts
│   └── utils/
│       ├── telegram.ts
│       └── openai.ts
├── .env.example
├── .gitignore
├── netlify.toml
├── next.config.js
├── package.json
└── tsconfig.json
```

## Ключевые файлы и их содержимое

### 1. .env.example

```
NEXT_PUBLIC_API_BASE_URL=https://your-site.netlify.app
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
TELEGRAM_CHAT_ID=your_telegram_chat_id
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### 2. netlify.toml

```toml
[build]
  command = "npm run build"
  functions = "functions"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. app/layout.tsx

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Factory Pro',
  description: 'AI-powered content generation and scheduling platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 4. app/page.tsx

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContentForm from '@/components/ContentForm';
import AnalyticsCard from '@/components/AnalyticsCard';

export default function Home() {
  const [contentList, setContentList] = useState([]);

  return (
    <main className="container">
      <h1>Content Factory Pro</h1>
      <div className="grid">
        <ContentForm onSubmit={(content) => {
          setContentList([...contentList, content]);
        }} />
        <section>
          <h2>Содержимое</h2>
          {contentList.map((item, index) => (
            <AnalyticsCard key={index} data={item} />
          ))}
        </section>
      </div>
    </main>
  );
}
```

### 5. lib/api.ts

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function generateContent(prompt: string) {
  const response = await fetch(`${baseURL}/api/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}

export async function schedulePost(postData: any) {
  const response = await fetch(`${baseURL}/api/schedule-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return response.json();
}

export async function getAnalytics() {
  const response = await fetch(`${baseURL}/api/analytics`);
  return response.json();
}
```

### 6. lib/store.ts (Zustand store)

```typescript
import { create } from 'zustand';

interface ContentState {
  contents: any[];
  isLoading: boolean;
  error: string | null;
  addContent: (content: any) => void;
  removeContent: (id: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  contents: [],
  isLoading: false,
  error: null,
  addContent: (content) =>
    set((state) => ({
      contents: [...state.contents, { ...content, id: Date.now().toString() }],
    })),
  removeContent: (id) =>
    set((state) => ({
      contents: state.contents.filter((c) => c.id !== id),
    })),
}));
```

### 7. functions/api/generate-content.ts

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a content creation expert' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: data.choices[0].message.content,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
```

### 8. functions/api/schedule-post.ts

```typescript
import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    const postData = JSON.parse(event.body || '{}');
    
    // Сохраняем в базу данных
    const response = await fetch(process.env.DATABASE_URL + '/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postData,
        scheduledAt: new Date(postData.scheduledAt),
        status: 'scheduled',
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: await response.json() }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
```

## Инструкции по развертыванию на Netlify

### Шаг 1: Подготовка локально

```bash
# Клонируйте репозиторий
git clone https://github.com/gerifort7-source/content-factory-netlify.git
cd content-factory-netlify

# Установите зависимости
npm install

# Создайте .env файл
cp .env.example .env

# Заполните переменные окружения
```

### Шаг 2: Подключение к Netlify

1. Перейдите на https://app.netlify.com
2. Нажмите "New site from Git"
3. Выберите GitHub и авторизуйтесь
4. Выберите репозиторий `content-factory-netlify`
5. Netlify автоматически определит параметры сборки

### Шаг 3: Переменные окружения

1. Перейдите в Settings > Environment
2. Добавьте следующие переменные:
   - NEXT_PUBLIC_API_BASE_URL: URL вашего сайта на Netlify
   - OPENAI_API_KEY: Ваш ключ OpenAI API
   - NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: Токен вашего Telegram бота
   - DATABASE_URL: URL вашей базы данных

### Шаг 4: Развертывание

1. Нажмите "Deploy site"
2. Дождитесь завершения сборки
3. Проверьте логи для отладки

## Компоненты фронтенда

### ContentForm.tsx

```typescript
'use client';

import { useState } from 'react';
import { generateContent, schedulePost } from '@/lib/api';

interface ContentFormProps {
  onSubmit?: (content: any) => void;
}

export default function ContentForm({ onSubmit }: ContentFormProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateContent(prompt);
      setContent(result.content);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSchedule = async () => {
    try {
      await schedulePost({
        content,
        scheduledAt: new Date(),
      });
      onSubmit?.({ content, scheduledAt: new Date() });
      setContent('');
      setPrompt('');
    } catch (error) {
      console.error('Error scheduling:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Генерировать контент</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите промпт для генерации контента"
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Генерирую...' : 'Генерировать'}
      </button>
      {content && (
        <div>
          <h3>Сгенерированный контент:</h3>
          <p>{content}</p>
          <button onClick={handleSchedule}>Запланировать</button>
        </div>
      )}
    </div>
  );
}
```

### AnalyticsCard.tsx

```typescript
'use client';

interface AnalyticsCardProps {
  data: any;
}

export default function AnalyticsCard({ data }: AnalyticsCardProps) {
  return (
    <div className="card">
      <h3>Аналитика</h3>
      <p>Контент: {data.content?.substring(0, 100)}...</p>
      <p>Дата: {new Date(data.scheduledAt).toLocaleString('ru-RU')}</p>
      <p>Статус: {data.status || 'Запланировано'}</p>
    </div>
  );
}
```

## Troubleshooting

### Ошибка при развертывании

1. Проверьте логи в Netlify Dashboard
2. Убедитесь, что все зависимости установлены
3. Проверьте переменные окружения
4. Убедитесь, что функции находятся в папке `functions`

### Проблемы с API

1. Проверьте CORS в netlify.toml
2. Убедитесь, что все функции экспортируют `handler`
3. Проверьте формат событий Netlify Functions

## Дальнейшие улучшения

- Добавить аутентификацию
- Расширить поддержку платформ (Instagram, TikTok)
- Добавить расширенную аналитику
- Реализовать кэширование
- Добавить уведомления

## Лицензия

MIT
