# TrifSync - Family Calendar Application

A smart family calendar application with AI assistant, multi-service integration, and intelligent notifications.

## Features

- 📅 **Unified Calendar View** - Aggregate events from Google Calendar, Apple Calendar, and Outlook
- 🤖 **AI Assistant** - Ask questions about your schedule and get intelligent insights
- 📱 **Mobile-First Design** - Responsive UI optimized for mobile devices
- 🔐 **Secure Authentication** - OAuth integration with Google and Apple
- 🔔 **Smart Notifications** - Departure alerts, weather updates, and personalized reminders
- 👨‍👩‍👧‍👦 **Family Management** - Manage multiple family members and their calendars
- 🌐 **Real-time Sync** - Live updates across all connected services

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: PostgreSQL (via Supabase)
- **AI**: OpenAI GPT-4
- **Calendar APIs**: Google Calendar API, Apple Calendar (CalDAV)
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console project (for Google Calendar API)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd trifsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here

   # Google Calendar API
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # Apple Calendar API (CalDAV)
   APPLE_CALDAV_URL=your_apple_caldav_url_here
   APPLE_CALDAV_USERNAME=your_apple_username_here
   APPLE_CALDAV_PASSWORD=your_apple_password_here

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (coming soon)
   - Get your project URL and API keys

5. **Set up Google Calendar API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
trifsync/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── calendar/          # Calendar pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── calendar/          # Calendar-specific components
│   │   ├── ai/                # AI assistant components
│   │   └── auth/              # Authentication components
│   ├── lib/                   # Utility libraries
│   │   ├── auth/              # Authentication logic
│   │   ├── calendar/          # Calendar service integrations
│   │   ├── ai/                # AI agent logic
│   │   └── supabase/          # Supabase client configuration
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── docs/                     # Documentation
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Follow React best practices and hooks patterns

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Complete authentication flow
- [ ] Implement calendar service integrations
- [ ] Add AI assistant functionality
- [ ] Create mobile app (React Native)
- [ ] Add real-time notifications
- [ ] Implement family member management
- [ ] Add event creation and editing
- [ ] Create admin dashboard
- [ ] Add data export/import features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@trifsync.com or create an issue in the GitHub repository.