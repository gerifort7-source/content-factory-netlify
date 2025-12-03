'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  scheduleTime: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
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

    const newPost: Post = {
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

  const deletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    setStatus('🗑️ Пост удален');
    setTimeout(() => setStatus(''), 3000);
  };

  const publishPost = async (post: Post) => {
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
    <main style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1a202c',
            margin: '0 0 10px 0'
          }}>
            📱 Content Factory Pro
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#4a5568',
            margin: 0
          }}>
            Управляйте постами для Telegram с легкостью
          </p>
        </div>

        {/* Форма добавления поста */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginTop: 0,
            marginBottom: '20px'
          }}>
            ✍️ Новый пост
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Содержание
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите содержание"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                minHeight: '120px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Время публикации (опционально)
            </label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={addPost}
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2c5aa0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
          >
            ➕ Добавить пост
          </button>

          {status && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#f0f4f8',
              borderRadius: '6px',
              color: '#2d3748',
              fontWeight: '600'
            }}>
              {status}
            </div>
          )}
        </div>

        {/* Список постов */}
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginTop: 0,
            marginBottom: '20px'
          }}>
            📋 Мои посты ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f7fafc',
              borderRadius: '12px',
              color: '#718096'
            }}>
              Пока нет постов. Создайте свой первый пост!
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    borderLeft: '4px solid #3182ce'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1a202c',
                        margin: '0 0 5px 0'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#718096',
                        margin: 0
                      }}>
                        {new Date(post.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: post.status === 'Опубликован ✓' ? '#48bb78' : '#edf2f7',
                      color: post.status === 'Опубликован ✓' ? 'white' : '#2d3748',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {post.status}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: '#2d3748',
                    margin: '10px 0',
                    lineHeight: '1.6'
                  }}>
                    {post.content}
                  </p>
                  {post.scheduleTime && (
                    <p style={{
                      fontSize: '14px',
                      color: '#718096',
                      margin: '10px 0'
                    }}>
                      📅 Запланировано: {new Date(post.scheduleTime).toLocaleString('ru-RU')}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    {post.status !== 'Опубликован ✓' && (
                      <button
                        onClick={() => publishPost(post)}
                        disabled={loading}
                        style={{
                          backgroundColor: loading ? '#cbd5e0' : '#48bb78',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        📤 Опубликовать
                      </button>
                    )}
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        backgroundColor: '#f56565',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e53e3e')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f56565')}
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
