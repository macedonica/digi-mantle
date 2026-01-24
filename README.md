# Bibliotheca Macedonica - Digital Archive

A digital archive dedicated to preserving and sharing Macedonian cultural heritage, including books, periodicals, and historical images.

**Website**: https://bibliothecamacedonica.com

## Features

- 📚 Browse digitized books, periodicals, and historical images
- 🔍 Advanced search and filtering by year, language, category, and author
- 🌐 Bilingual interface (Macedonian/English)
- 📱 Fully responsive design
- 🔒 Admin dashboard for content management
- 📄 PDF viewer for books and periodicals
- 🖼️ Image gallery with zoom functionality

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: cPanel with static file deployment

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Create .env file with your Supabase credentials
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to cPanel

1. Run `npm run build` locally
2. Upload the contents of the `dist` folder to `public_html` on your server
3. Ensure the `.htaccess` file is in place for SPA routing

### .htaccess for SPA Routing

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Documentation

- [Self-Hosting Guide](docs/SELF_HOSTING_GUIDE.md) - Setting up your own Supabase project
- [Data Migration Guide](docs/DATA_MIGRATION_GUIDE.md) - Migrating data between environments

## License

All rights reserved. The content and images in this archive are protected by copyright.
