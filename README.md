# insta-auto-dm

**Automate Instagram DMs based on comment keywords.**

Automatically send direct messages to anyone who comments on your Instagram posts with specific keywords. Open-source, self-hosted, free.

## Features

- 📝 **Keyword Triggers**: Set keywords and responses
- ⚡ **Instant Replies**: Auto-DM within seconds
- 📊 **Activity Logs**: Track every DM sent
- 🔒 **Open Source**: Full transparency
- 🏠 **Self-Hosted**: Run anywhere
- 💰 **Free**: No subscription fees

## Tech Stack

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Neon)
- **Auth**: Meta Instagram Graph API
- **Deployment**: Vercel, Docker, or any Node.js host

## Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn
- PostgreSQL database (Neon is free)
- Meta Business Account with Instagram App

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/insta-auto-dm.git
cd insta-auto-dm
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/insta_auto_dm"

# Meta Instagram Graph API
META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_PAGE_ACCESS_TOKEN="your_page_access_token"
META_VERIFY_TOKEN="any_random_string_you_choose"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

4. **Set up the database**

```bash
npx prisma migrate dev
```

5. **Run locally**

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## Configuration

### Step 1: Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app (type: Business)
3. Add **Instagram Basic Display** product
4. Add **Webhooks** product
5. Get your App ID and App Secret

### Step 2: Get an Instagram Access Token

1. Go to your app dashboard
2. Under **Messenger** > **Settings**, generate a page access token
3. Copy it to `META_PAGE_ACCESS_TOKEN`

### Step 3: Configure the Webhook

1. Go to **Webhooks** settings
2. **Subscribe** to the webhook with:
   - URL: `https://yourdomain.com/api/webhooks/instagram`
   - Verify Token: The value you set in `META_VERIFY_TOKEN`
3. **Subscribe** to these fields: `comments`

### Step 4: Set Your App to Live Mode

1. Go to **Settings** > **Basic**
2. Click **Switch to Live Mode**

## Usage

### Create a Trigger

1. Go to the dashboard: `http://localhost:3000/dashboard`
2. Enter a keyword (e.g., "promo", "help", "discount")
3. Enter the response message
4. Click **Create**

### Test It

1. Post something on Instagram
2. Comment with your keyword
3. Check your DMs - the bot will reply automatically!

### View Logs

Visit `/api/logs?page=1&limit=10` to see all sent DMs.

## API Reference

### Triggers

#### GET `/api/triggers`
Fetch all triggers.

```bash
curl http://localhost:3000/api/triggers
```

Response:
```json
[
  {
    "id": "clh...",
    "keyword": "promo",
    "responseMsg": "Hey! Check out our latest offer!",
    "enabled": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

#### POST `/api/triggers`
Create a new trigger.

```bash
curl -X POST http://localhost:3000/api/triggers \
  -H "Content-Type: application/json" \
  -d '{"keyword":"promo","responseMsg":"Check our offer!"}'
```

#### PUT `/api/triggers/[id]`
Update a trigger.

```bash
curl -X PUT http://localhost:3000/api/triggers/clh... \
  -H "Content-Type: application/json" \
  -d '{"keyword":"offer","responseMsg":"New message"}'
```

#### DELETE `/api/triggers/[id]`
Delete a trigger.

```bash
curl -X DELETE http://localhost:3000/api/triggers/clh...
```

### Webhooks

#### GET `/api/webhooks/instagram`
Meta verification endpoint (called automatically).

#### POST `/api/webhooks/instagram`
Receive comment events from Meta (called automatically).

### Logs

#### GET `/api/logs?page=1&limit=10&status=sent`
Fetch activity logs.

```bash
curl http://localhost:3000/api/logs
```

Response:
```json
{
  "logs": [
    {
      "id": "log...",
      "triggerId": "clh...",
      "userId": "123456789",
      "userName": "john_doe",
      "message": "Check our offer!",
      "status": "sent",
      "error": null,
      "timestamp": "2024-01-15T10:05:00Z",
      "trigger": {
        "keyword": "promo"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set environment variables in project settings
4. Deploy!

```bash
vercel deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
docker build -t insta-auto-dm .
docker run -e DATABASE_URL=... -p 3000:3000 insta-auto-dm
```

### Self-Hosted (VPS)

```bash
# On your VPS
git clone https://github.com/yourusername/insta-auto-dm.git
cd insta-auto-dm
npm install
npm run build

# Create .env.local with your variables

# Run with PM2
npm install -g pm2
pm2 start npm --name insta-auto-dm -- start
pm2 save
pm2 startup

# Set up reverse proxy (nginx)
# Point your domain to the app
```

## Troubleshooting

### Webhook not receiving events

1. Check that your app is in **Live Mode**
2. Verify the webhook URL is publicly accessible
3. Check the webhook logs in Meta app dashboard
4. Ensure `META_VERIFY_TOKEN` matches

### DMs not sending

1. Check that `META_PAGE_ACCESS_TOKEN` has the right permissions
2. Look at `/api/logs` for error messages
3. Verify the user actually commented with the keyword
4. Check that the trigger is **enabled** in the dashboard

### Database connection errors

1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Run migrations: `npx prisma migrate dev`

## Architecture

```
app/
├── api/
│   ├── triggers/              # CRUD endpoints
│   ├── webhooks/instagram/    # Meta webhook receiver
│   └── logs/                  # Activity logs
├── dashboard/                 # UI for managing triggers
├── landing/                   # Marketing page
└── layout.tsx                 # Root layout
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── layout/                # Header, Footer
└── lib/
    ├── db.ts                  # Prisma client
    ├── logger.ts              # Debug logging
    └── instagram-api.ts       # Meta API utilities
prisma/
└── schema.prisma              # Database schema
```

## How It Works

1. **User sets up a trigger** in the dashboard (e.g., keyword="promo", responseMsg="...")
2. **Someone comments on an Instagram post** with that keyword
3. **Meta sends a webhook** to `/api/webhooks/instagram`
4. **The app receives the event**, matches the keyword against active triggers
5. **App sends a DM** to the commenter using Meta's Graph API
6. **Activity is logged** in the database for tracking

## Development

### Run tests

```bash
npm test
```

### Debug mode

```bash
DEBUG=* npm run dev
```

### Database migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

## License

MIT - See LICENSE file

## Pricing

### Self-Hosted
- **$0/month** - Use your own server
- Server costs typically $5-10/month on Vercel or a VPS

### Managed Hosting
- **$5-10/month** - We run the server for you
- Includes automatic updates and support

## Support

- **Issues**: GitHub Issues
- **Email**: contact@example.com
- **Docs**: Full documentation in `/docs` folder

## Roadmap

- [ ] UI for activity logs dashboard
- [ ] Scheduled triggers (time-based)
- [ ] Multiple response variants (A/B testing)
- [ ] Advanced analytics
- [ ] API key authentication for programmatic access
- [ ] Rate limiting per account
- [ ] Webhook retry logic
- [ ] Mobile app

---

**Made with ❤️ for Instagram creators**

[GitHub](https://github.com) | [Twitter](https://twitter.com) | [Website](https://example.com)
