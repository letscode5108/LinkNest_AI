# Link Saver

AI-powered link management application with automatic tagging and content summaries.

## Features

- **Smart Link Saving**: Automatic metadata extraction and AI-powered categorization
- **Intelligent Search**: Full-text search with tag filtering
- **AI Summaries**: Content analysis using Google Gemini AI
- **Secure Authentication**: JWT-based user management
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui

## Tech Stack

**Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL  
**Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui  
**AI**: Google Gemini API  
**Authentication**: JWT with bcryptjs

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone and setup backend**
```bash
git clone <repo-url>
cd link-saver/backend
npm install
```

2. **Environment configuration**
```env
DATABASE_URL=""


3. **Database setup**
```bash
npx prisma generate
npx prisma db push
npm run dev
```

4. **Frontend setup**
```bash
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
npm start
```

## API Reference

### Authentication
```
POST /api/auth/register    # Create account
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
POST /api/auth/refresh     # Refresh token
```

### Links
```
POST   /api/links           # Save link
GET    /api/links           # Get links (paginated)
GET    /api/links/:id       # Get link with AI summary
DELETE /api/links/:id       # Delete link
GET    /api/links/search    # Search/filter links
```

### Query Parameters
- `page`, `limit` - Pagination
- `q` - Search query (title, description, domain, URL)
- `tags` - Filter by tag category



## Development

**Start development servers:**
```bash
# Backend
npm run dev

# Frontend  
npm start
```

**Database management:**
```bash
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
```

## Deployment

1. Build frontend: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Vercel, Railway, etc.)

## License

MIT License
