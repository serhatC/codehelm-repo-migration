
# CodeHelm Repository Migration Tool

A comprehensive repository migration tool that supports seamless migrations between GitHub, GitLab, and Bitbucket with advanced authentication options and premium features.

## 🚀 Features

### Multi-Platform Support
- **GitHub** - Full repository migration support
- **GitLab** - Complete API integration
- **Bitbucket** - Seamless migration capabilities

### Advanced Authentication
- 📧 **Email/Password** - Traditional authentication
- 🔗 **Magic Link** - Passwordless login via email
- 🐙 **GitHub OAuth** - Authenticate with GitHub
- 🦊 **GitLab OAuth** - Authenticate with GitLab
- 🔐 **Google OAuth** - Sign in with Google

### Migration Features
- ✅ Multiple repository selection
- 📊 Real-time progress tracking
- 🔄 Retry failed migrations
- 📝 Detailed error reporting
- 🎯 Migration history tracking
- 📋 Repository management dashboard

### Premium Features
- 💎 Large file support (LTS)
- 🚀 Priority processing
- 📈 Advanced analytics
- 🔧 Custom migration options

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/serhatC/codehelm-repo-migration.git
cd codehelm-repo-migration
```

2. **Install dependencies**
```bash
cd app
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the `app` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/repo_migration"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# GitLab OAuth
GITLAB_ID="your-gitlab-application-id"
GITLAB_SECRET="your-gitlab-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Server (for Magic Links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

4. **Set up the database**
```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

5. **Run the development server**
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 OAuth Setup

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### GitLab OAuth
1. Go to [GitLab Applications](https://gitlab.com/-/profile/applications)
2. Create a new application
3. Set Redirect URI to: `http://localhost:3000/api/auth/callback/gitlab`
4. Select scopes: `api`, `read_api`, `read_user`
5. Copy Application ID and Secret to `.env`

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set Authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

## 📊 Database Schema

The application uses Prisma with PostgreSQL and includes the following models:

- **User** - User accounts and profiles
- **Account** - OAuth account linking
- **Session** - User sessions
- **VerificationToken** - Magic link tokens
- **Repository** - Repository metadata
- **Migration** - Migration tracking and history

## 🎨 UI Components

Built with **shadcn/ui** components:
- Cards, Buttons, Forms
- Tabs, Dialogs, Dropdowns
- Progress bars, Toast notifications
- Data tables, Badges, Avatars

## 🚦 API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/repositories` - Repository management
- `/api/migrations` - Migration operations
- `/api/dashboard` - Dashboard statistics

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please open an issue on GitHub.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js and modern web technologies
