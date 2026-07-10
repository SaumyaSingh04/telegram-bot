# 🤖 Telegram AI Bot

Production-ready Telegram AI Bot built with Node.js, Express, Telegraf, and the Groq API (OpenAI-compatible SDK).

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Runtime    | Node.js 18+ (ES Modules)            |
| Web Server | Express                             |
| Telegram   | Telegraf                            |
| AI         | Groq API via OpenAI SDK             |
| Validation | Joi                                 |
| Logging    | Winston + Morgan                    |
| Security   | Helmet, CORS, express-rate-limit    |
| Dev        | Nodemon                             |

---

## 📁 Project Structure

```
src/
├── bot/
│   ├── commands/         # /start, /help, /new, /clear, /ping, /about, /stats, /settings
│   ├── handlers/         # Text message handler
│   ├── middlewares/      # Logger, session, typing indicator
│   └── bot.js            # Telegraf instance + wiring
├── config/
│   └── index.js          # Joi-validated env config (single source of truth)
├── constants/            # HTTP status codes, bot messages, AI defaults
├── controllers/          # Express route controllers
├── helpers/
│   └── formatMessage.js  # Markdown helpers, safeMarkdownReply
├── logger/
│   └── index.js          # Winston logger (file + console)
├── middleware/
│   ├── errorHandler.js   # Global Express error handler
│   ├── rateLimiter.js    # Global + strict rate limiters
│   └── security.js       # Helmet, CORS, compression
├── prompts/
│   └── system.js         # Default AI system prompt
├── repositories/
│   └── sessionRepository.js  # In-memory session store (swap for Redis)
├── services/
│   ├── botService.js     # Orchestrates AI calls + session management
│   └── groqService.js    # Groq API client with retry + streaming
├── utils/
│   ├── AppError.js       # Operational error class
│   ├── asyncHandler.js   # Express async wrapper
│   └── response.js       # sendSuccess / sendError helpers
├── validators/
│   └── chat.js           # Joi schema for POST /chat
├── app.js                # Express app setup
└── server.js             # Entry point (polling ↔ webhook)
```

---

## ⚙️ Setup

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable              | Required         | Description                                      |
|-----------------------|------------------|--------------------------------------------------|
| `TELEGRAM_BOT_TOKEN`  | ✅ always        | From [@BotFather](https://t.me/BotFather)        |
| `GROQ_API_KEY`        | ✅ always        | From [console.groq.com](https://console.groq.com)|
| `WEBHOOK_DOMAIN`      | ✅ production    | Public HTTPS domain, e.g. `https://example.com`  |
| `WEBHOOK_PATH`        | optional         | Default: `/webhook/telegram`                     |
| `PORT`                | optional         | Default: `3000`                                  |
| `NODE_ENV`            | optional         | `development` \| `production`                    |
| `GROQ_MODEL`          | optional         | Default: `llama-3.3-70b-versatile`               |
| `CORS_ORIGIN`         | optional         | Comma-separated origins (production)             |
| `RATE_LIMIT_WINDOW_MS`| optional         | Default: `60000`                                 |
| `RATE_LIMIT_MAX`      | optional         | Default: `100`                                   |
| `LOG_LEVEL`           | optional         | `error` \| `warn` \| `info` \| `debug`           |

### 3. Run

```bash
# Development (polling mode)
npm run dev

# Production (webhook mode)
npm start
```

---

## 🔌 API Endpoints

| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/health`               | Health check + uptime              |
| GET    | `/api/v1/status`        | Bot running status + timestamp     |
| POST   | `/api/v1/chat`          | Send a message, get AI reply       |
| POST   | `/api/v1/chat/clear`    | Clear conversation history         |
| POST   | `WEBHOOK_PATH`          | Telegram webhook (production only) |

**POST `/api/v1/chat` body:**
```json
{ "message": "Hello!", "userId": "optional-string" }
```

---

## 🤖 Bot Commands

| Command     | Description                        |
|-------------|------------------------------------|
| `/start`    | Welcome message                    |
| `/help`     | List all commands                  |
| `/new`      | Start a fresh conversation         |
| `/clear`    | Clear conversation history         |
| `/ping`     | Check bot latency                  |
| `/about`    | About this bot                     |
| `/stats`    | Your usage statistics              |
| `/settings` | View your current AI settings      |

---

## 🏗️ Architecture

- **Development** → polling mode (`bot.launch()`)
- **Production** → webhook mode (Telegram pushes to Express)
- Conversation history is stored **in-memory** per user — swap `sessionRepository.js` with a Redis adapter for multi-instance deployments
- All AI calls go through `groqService` (retry logic, timeout, streaming support) → `botService` (session orchestration) → handlers
- Config is validated at startup via Joi; the process exits immediately on missing required vars

---

## 📦 Deployment

1. Set `NODE_ENV=production` and `WEBHOOK_DOMAIN` to your public HTTPS URL
2. Ensure a valid TLS certificate is in place (Telegram requires HTTPS for webhooks)
3. Run `npm start`

---

## 📄 License

MIT
# telegram-bot
# premium-bot
