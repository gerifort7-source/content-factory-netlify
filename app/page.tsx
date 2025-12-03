'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем посты из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки:', e);
      }
    }
  }, []);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = () => {
    if (!title.trim() || !content.trim()) {
      setStatus('⚠️ Заполните все поля!');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      scheduleTime: scheduleTime || new Date().toISOString(),
      status: 'Создан',
      createdAt: new Date().toISOString(),
    };

    setPosts([...posts, newPost]);
    setTitle('');
    setContent('');
    setScheduleTime('');
    setStatus('✅ Пост добавлен!');
    setTimeout(() => setStatus(''), 3000);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    setStatus('🗑️ Пост удален');
    setTimeout(() => setStatus(''), 3000);
  };

  const publishPost = async (post) => {
    setLoading(true);
    try {
      // Имитация отправки в Telegram
      const updatedPosts = posts.map(p => 
        p.id === post.id ? { ...p, status: 'Опубликован ✓' } : p
      );
      setPosts(updatedPosts);
      setStatus('📤 Опубликовано в Telegram!');
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      setStatus('❌ Ошибка отправки');
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a202c', margin: '0 0 10px 0' }}
          >
            📱 Content Factory Pro
          </h1>
          <p style={{ fontSize: '18px', color: '#4a5568', margin: 0 }}
          >
            Управление контентом и планирование постов для Telegram
          </p>
        </div>

        {/* Статус */}
        {status && (
          <div style={{ 
            background: '#e6f7ed', 
            color: '#22543d', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            {status}
          </div>
        )}

        {/* Форма создания поста */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: 0, marginBottom: '20px' }}>
            ✏️ Создать новый пост
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2d3748' }}>
              Заголовок:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2d3748' }}>
              Содержимое:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напишите содержимое поста"
              rows="6"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2d3748' }}>
              Время публикации:
            </label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={addPost}
            disabled={loading}
            style={{
              background: '#3182ce',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Отправка...' : '➕ Добавить пост'}
          </button>
        </div>

        {/* Список постов */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            📋 Посты ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '12px',
              color: '#718096'
            }}>
              <p style={{ fontSize: '18px' }}>Нет постов. Создайте первый пост! 👆</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3182ce'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#1a202c', fontSize: '20px', fontWeight: 'bold' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: '#718096', margin: '5px 0', fontSize: '14px' }}>
                        Создан: {new Date(post.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <span style={{
                      background: post.status.includes('Опубликован') ? '#c6f6d5' : '#faf089',
                      color: post.status.includes('Опубликован') ? '#22543d' : '#7c2d12',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {post.status}
                    </span>
                  </div>

                  <p style={{ margin: '15px 0', color: '#2d3748', lineHeight: '1.6' }}>
                    {post.content}
                  </p>

                  {post.scheduleTime && (
                    <p style={{ color: '#4a5568', fontSize: '14px', marginBottom: '15px' }}>
                      📅 Запланировано: {new Date(post.scheduleTime).toLocaleString('ru-RU')}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => publishPost(post)}
                      disabled={loading || post.status.includes('Опубликован')}
                      style={{
                        background: post.status.includes('Опубликован') ? '#cbd5e0' : '#48bb78',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      📤 {post.status.includes('Опубликован') ? 'Опубликовано' : 'Опубликовать'}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        background: '#fc8181',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
