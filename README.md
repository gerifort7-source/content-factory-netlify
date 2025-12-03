# Content Factory Pro - Netlify Version

🚀 AI-powered content generation and scheduling platform with Telegram integration, deployed on Netlify

## Features

✅ **Content Generation** - Generate content using OpenAI/Claude API  
✅ **Telegram Integration** - Auto-publish to Telegram channels  
✅ **Content Scheduling** - Schedule posts for automatic publishing  
✅ **Admin Panel** - Manage all content from one place  
✅ **Analytics** - Track performance and statistics  
✅ **Netlify Functions** - Serverless backend  
✅ **Next.js** - Fast and modern frontend

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/gerifort7-source/content-factory-netlify.git
cd content-factory-netlify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

## Deployment on Netlify

### Option 1: Automatic Deployment from GitHub

1. Push code to GitHub
2. Connect repository to Netlify
3. Netlify automatically builds and deploys

### Option 2: Manual Deployment

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Environment Variables

Set these in Netlify Build Settings > Environment:

```
NEXT_PUBLIC_API_BASE_URL=https://your-site.netlify.app
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
JWT_SECRET=your_secret
```

## Project Structure

```
├── app/              # Next.js app directory
├── lib/              # Utility functions
├── components/       # React components
├── functions/        # Netlify Functions (serverless)
├── netlify.toml      # Netlify configuration
└── package.json      # Dependencies
```

## Key Files

- **netlify.toml** - Netlify build and deployment configuration
- **next.config.js** - Next.js configuration
- **tsconfig.json** - TypeScript configuration
- **COMPREHENSIVE_NETLIFY_SETUP.md** - Full implementation guide

## Documentation

Refer to [COMPREHENSIVE_NETLIFY_SETUP.md](./COMPREHENSIVE_NETLIFY_SETUP.md) for detailed setup instructions, code examples, and troubleshooting.

## Support

- 📖 Read the documentation
- 🐛 Report issues on GitHub
- 💬 Discuss in GitHub Discussions

## License

MIT
