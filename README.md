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

## Meta Instagram Graph API 설정 (자세한 가이드)

### Step 1: Facebook Developer Console에서 앱 생성

1. [Meta for Developers](https://developers.facebook.com/)에 접속
2. "My Apps" → "Create App" 클릭
3. 앱 유형: **Business** 선택
4. 앱 이름 입력 (예: "Instagram Auto DM Bot")
5. 앱 생성 완료 후 **앱 ID**와 **앱 비밀번호** 복사 (`.env.local`의 `META_APP_ID`, `META_APP_SECRET`에 저장)

### Step 2: Instagram Basic Display / Instagram Graph API 추가

1. 앱 대시보드에서 "제품 추가" (Add Products) 클릭
2. **Instagram Basic Display** 검색 후 "추가"
3. **Instagram Graph API** 검색 후 "추가"

### Step 3: Webhook 설정

1. 앱 대시보드 좌측 메뉴에서 **Webhooks** 클릭
2. **Pages** 선택
3. "페이지 구독" (Subscribe to this object) 클릭
4. **Webhook URL**: `https://yourdomain.com/api/webhooks/instagram`
   - 로컬 개발: `ngrok`을 사용해 공개 URL 생성 (`ngrok http 3000` → HTTPS URL 사용)
   - 배포: Vercel URL 사용 (예: `https://insta-auto-dm-123.vercel.app/api/webhooks/instagram`)
5. **Verify Token**: `.env.local`의 `META_VERIFY_TOKEN`에 설정한 값 입력
6. **구독할 필드**: `comments` 체크
7. "확인" (Verify and Save) 클릭

### Step 4: 필수 권한 설정

1. 앱 대시보드 → **Settings** → **Basic**
2. "App Roles" 섹션에서:
   - `instagram_manage_messages` - DM 전송 권한
   - `instagram_manage_comments` - 댓글 읽기 권한
   - `pages_manage_metadata` - 페이지 정보 조회 권한
   추가 확인

### Step 5: 테스트 계정 추가

1. 앱 대시보드 → **Roles** → **Test Users**
2. "테스트 사용자 추가" (Add Test User) 클릭
3. Instagram 계정을 테스트 계정으로 추가
4. 권한 설정: `instagram_graph_user_media`, `instagram_basic_display`, `pages_read_user_profile` 선택

### Step 6: 앱을 Live Mode로 전환

1. 앱 대시보드 → **Settings** > **Basic**
2. 상단의 "Development" → "Live" 전환
3. 공개 설명 (Public Description) 입력 (필수)
4. 앱 아이콘 업로드 (권장)
5. 확인 후 Live Mode 활성화

## Neon PostgreSQL 설정 방법

1. [Neon Console](https://console.neon.tech/)에 접속 (GitHub/Google 로그인)
2. "Create Project" 클릭
3. 프로젝트 이름 입력 (예: "insta-auto-dm")
4. PostgreSQL 버전 선택 (최신 권장)
5. 프로젝트 생성 완료
6. **Connection String** 복사
   - 우측 "Connect" 버튼 클릭
   - "Direct" 탭에서 PostgreSQL 연결 문자열 복사 (예: `postgresql://user:password@ep-xxxxx.neon.tech/neon?sslmode=require`)
7. `.env.local` (또는 Vercel 환경변수)에 `DATABASE_URL`로 설정
8. 로컬에서 마이그레이션 실행: `npx prisma migrate dev`

## 환경변수 설명 (.env.example 기준)

```env
# 필수: Meta Instagram Graph API
META_APP_ID="123456789"                          # Meta Developer Console에서 앱 생성 후 얻은 ID
META_APP_SECRET="abc123def456..."               # Meta Developer Console에서 앱 생성 후 얻은 비밀번호
META_PAGE_ACCESS_TOKEN="EAAxxxxx..."            # Meta 페이지 접근 토큰 (Instagram 계정 연결)
META_VERIFY_TOKEN="any_random_string_here"      # Webhook 검증용 토큰 (임의 문자열 가능)

# 필수: 데이터베이스
DATABASE_URL="postgresql://user:password@host:5432/insta_auto_dm"  # Neon 또는 로컬 PostgreSQL

# 필수: 애플리케이션
NEXT_PUBLIC_APP_URL="http://localhost:3000"     # 앱의 공개 URL (로컬에선 localhost, 배포 시 Vercel URL)
NODE_ENV="development"                           # 개발: "development", 배포: "production"
```

### 환경변수 얻는 방법

1. **Meta API 토큰**
   - [Meta for Developers](https://developers.facebook.com/) → 앱 선택
   - 앱 ID, 앱 비밀번호: **Settings** > **Basic**
   - 페이지 액세스 토큰: **Messenger** > **Settings** > "Generate Page Access Token"

2. **Neon DATABASE_URL**
   - [Neon Console](https://console.neon.tech/) → 프로젝트 선택
   - **Connect** 버튼 → PostgreSQL 연결 문자열 복사

3. **Verify Token**
   - 임의의 안전한 문자열 생성 (예: `sha256`의 무작위 문자열)
   - Meta Webhook 설정 시 같은 값 사용

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

## 로컬 개발 시작 방법

### 전제 조건
- Node.js 18 이상 설치: [nodejs.org](https://nodejs.org/)
- PostgreSQL 또는 Neon 데이터베이스 URL 준비
- Meta Instagram Graph API 토큰 준비

### 로컬 실행 단계

1. **저장소 클론**
   ```bash
   git clone https://github.com/thedalbee/insta-auto-dm.git
   cd insta-auto-dm
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   cp .env.example .env.local
   # 텍스트 에디터로 .env.local 열고 Meta API 토큰, DATABASE_URL 입력
   ```

4. **데이터베이스 마이그레이션**
   ```bash
   npx prisma migrate dev
   # 또는 데이터베이스 초기화:
   npx prisma db push
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 브라우저에서 `http://localhost:3000` 접속
   - 대시보드: `http://localhost:3000/dashboard`

### Webhook 로컬 테스트 (ngrok)

Meta가 로컬 `localhost:3000`으로 요청을 보낼 수 없으므로 공개 URL이 필요합니다:

1. **ngrok 설치**: [ngrok.com](https://ngrok.com/) 또는 `brew install ngrok`
2. **ngrok 실행**
   ```bash
   ngrok http 3000
   ```
3. **HTTPS URL 복사** (예: `https://abcd-123-45-67.ngrok.io`)
4. **Meta Webhook 설정**에 `https://abcd-123-45-67.ngrok.io/api/webhooks/instagram` 입력
5. **로컬 서버** (`npm run dev`)와 **ngrok**이 동시에 실행 중이어야 함

## Deployment

### Vercel (권장)

1. 코드를 GitHub으로 push
2. [Vercel](https://vercel.com)에서 GitHub 계정으로 로그인
3. "Import Project" → GitHub 저장소 선택
4. **Environment Variables** 추가:
   - `DATABASE_URL` (Neon 연결 문자열)
   - `META_APP_ID`, `META_APP_SECRET`, `META_PAGE_ACCESS_TOKEN`, `META_VERIFY_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (배포된 Vercel URL)
5. "Deploy" 클릭
6. 배포 완료 후 Vercel 대시보드에서 URL 확인

```bash
# CLI로 배포 (선택사항)
npm install -g vercel
vercel deploy --prod
```

### Docker 셀프호스팅

1. **Dockerfile 생성** (프로젝트 루트):
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Docker 이미지 빌드**
   ```bash
   docker build -t insta-auto-dm .
   ```

3. **Docker 컨테이너 실행**
   ```bash
   docker run -d \
     -e DATABASE_URL="postgresql://user:password@db:5432/insta_auto_dm" \
     -e META_APP_ID="your_app_id" \
     -e META_APP_SECRET="your_app_secret" \
     -e META_PAGE_ACCESS_TOKEN="your_token" \
     -e META_VERIFY_TOKEN="your_verify_token" \
     -e NEXT_PUBLIC_APP_URL="https://yourdomain.com" \
     -p 3000:3000 \
     --name insta-auto-dm \
     insta-auto-dm
   ```

4. **Docker Compose** (선택사항, PostgreSQL 포함):
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         DATABASE_URL: "postgresql://user:password@db:5432/insta_auto_dm"
         META_APP_ID: "your_app_id"
         META_APP_SECRET: "your_app_secret"
         META_PAGE_ACCESS_TOKEN: "your_token"
         META_VERIFY_TOKEN: "your_verify_token"
         NEXT_PUBLIC_APP_URL: "https://yourdomain.com"
       depends_on:
         - db

     db:
       image: postgres:15-alpine
       environment:
         POSTGRES_DB: insta_auto_dm
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

   실행: `docker-compose up -d`

### Self-Hosted (VPS, 예: AWS EC2, DigitalOcean)

```bash
# VPS에 접속 후:
git clone https://github.com/thedalbee/insta-auto-dm.git
cd insta-auto-dm
npm install
npm run build

# .env.local 생성 및 환경변수 설정
nano .env.local
# (Meta API 토큰, DATABASE_URL 입력)

# 데이터베이스 마이그레이션
npx prisma migrate deploy

# PM2로 백그라운드 실행
npm install -g pm2
pm2 start npm --name insta-auto-dm -- start
pm2 save
pm2 startup

# Nginx 리버스 프록시 설정 (선택사항)
# /etc/nginx/sites-available/insta-auto-dm:
# server {
#     listen 80;
#     server_name yourdomain.com;
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#     }
# }
# sudo ln -s /etc/nginx/sites-available/insta-auto-dm /etc/nginx/sites-enabled/
# sudo nginx -t && sudo systemctl restart nginx
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
