# SmartPay Assist AI Split - Super App

🚀 **AI-Powered Bill Splitting Super App** with smart receipt processing, secure payments via SSLCommerce, and progressive web app capabilities.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emonhossennn/smart_pay_assist_ai_split)

## ✨ Features

### 🧠 Smart Bill Processing
- **AI Receipt Scanning**: Automatically extract items and amounts from receipt photos
- **Smart Item Assignment**: Intelligent assignment of bill items to participants
- **Real-time Calculation**: Live split calculations as you assign items

### 💳 Secure Payments
- **SSLCommerce Integration**: Secure payment processing for Bangladesh
- **Multiple Payment Methods**: Cards, mobile banking, internet banking
- **Payment Tracking**: Real-time payment status and history

### 📱 Progressive Web App
- **Offline Functionality**: Works without internet connection
- **Push Notifications**: Payment reminders and bill updates
- **Mobile-First Design**: Optimized for mobile devices
- **App-Like Experience**: Install on home screen

### 🔐 Enterprise Security
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Properly configured cross-origin requests
- **Data Encryption**: All sensitive data encrypted

## 🚀 Quick Deploy to Vercel

### One-Click Deployment

1. **Fork this repository** to your GitHub account
2. **Connect to Vercel**: 
   - Visit [vercel.com](https://vercel.com)
   - Import your forked repository
3. **Configure Environment Variables** (see below)
4. **Deploy**: Vercel will automatically build and deploy

### Environment Variables for Vercel

Set these in your Vercel dashboard under Project Settings → Environment Variables:

```bash
# Django Settings
DJANGO_SETTINGS_MODULE=smartpay_backend.settings.production
SECRET_KEY=your-very-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.vercel.app,.vercel.com,smartpay-assist-ai.vercel.app

# Database (use Vercel Postgres or external service)
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432

# CORS Settings
CORS_ALLOW_ALL_ORIGINS=True
VERCEL_ENV=production

# Email Settings (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=SmartPay <your-email@gmail.com>

# Redis for Celery (optional - use Upstash or similar)
REDIS_URL=redis://your-redis-url

# Frontend Environment
VITE_API_BASE_URL=https://your-app-name.vercel.app/api
```

## 💻 Local Development

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (or use SQLite for development)
- **Git**

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**:
   ```bash
   # For quick local development with SQLite
   USE_SQLITE=True python manage.py migrate --settings=smartpay_backend.settings.development
   
   # Create superuser
   USE_SQLITE=True python manage.py createsuperuser --settings=smartpay_backend.settings.development
   ```

5. **Run development server**:
   ```bash
   USE_SQLITE=True python manage.py runserver --settings=smartpay_backend.settings.development
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - Admin: http://localhost:8000/admin

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
USE_SQLITE=True python manage.py test --settings=smartpay_backend.settings.development

# Run specific app tests
USE_SQLITE=True python manage.py test apps.authentication.tests --settings=smartpay_backend.settings.development -v 2

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test --settings=smartpay_backend.settings.development
coverage report
```

### Frontend Tests

```bash
cd project

# Run tests (when implemented)
npm run test

# Lint code
npm run lint

# Build for production
npm run build
```

## 📁 Project Structure

```
.
├── backend/                    # Django REST API
│   ├── apps/
│   │   ├── authentication/     # JWT authentication
│   │   ├── bills/              # Bill management
│   │   ├── payments/           # Payment processing
│   │   └── notifications/      # Push notifications
│   ├── smartpay_backend/
│   │   └── settings/           # Environment-based settings
│   └── requirements.txt
├── project/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API service layer
│   │   ├── store/              # State management
│   │   ├── utils/              # Utility functions
│   │   └── App.tsx            # Main app component
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   └── sw.js              # Service worker
│   └── package.json
└── vercel.json                 # Vercel deployment config
```

## 🛠 Technology Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API framework
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Production database
- **Celery + Redis** - Background tasks
- **Gunicorn** - WSGI server
- **WhiteNoise** - Static file serving

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

### DevOps & Deployment
- **Vercel** - Hosting platform
- **GitHub Actions** - CI/CD (optional)
- **ESLint + Prettier** - Code formatting
- **PWA** - Progressive Web App features

## 🔧 Advanced Configuration

### Database Setup (Production)

For production, use a managed PostgreSQL service:

1. **Vercel Postgres** (Recommended):
   - Add Vercel Postgres addon in your dashboard
   - Environment variables are auto-configured

2. **External PostgreSQL** (Railway, Supabase, etc.):
   ```bash
   DB_NAME=your_database
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_HOST=your_host
   DB_PORT=5432
   ```

### SSL/HTTPS Configuration

Vercel provides automatic HTTPS. For custom domains:

1. Add your domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificate is automatically provisioned

### Performance Optimization

1. **Frontend**:
   - Automatic code splitting with Vite
   - Image optimization
   - Service worker caching

2. **Backend**:
   - Database query optimization
   - Redis caching (optional)
   - Static file compression

## 📱 Mobile App Features

### PWA Installation

**Android (Chrome/Edge)**:
1. Visit the app URL
2. Tap menu (⋮) → "Install app" or "Add to Home screen"

**iOS (Safari)**:
1. Visit the app URL
2. Tap Share → "Add to Home Screen"

**Desktop**:
1. Visit the app URL
2. Look for install prompt in address bar

### Offline Functionality

- **View bills** offline
- **Browse payment history**
- **Cache receipt images**
- **Sync when back online**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/emonhossennn/smart_pay_assist_ai_split/issues)
- **Documentation**: This README and inline code comments
- **Community**: Join our discussions

## 🚀 Roadmap

- [ ] **AI Receipt Processing**: Advanced OCR with machine learning
- [ ] **Multi-currency Support**: Support for different currencies
- [ ] **Group Management**: Create and manage bill-splitting groups
- [ ] **Expense Analytics**: Charts and insights for spending
- [ ] **Dark Mode**: Full dark theme support
- [ ] **Voice Commands**: "Add coffee to John's portion"
- [ ] **QR Code Sharing**: Share bills via QR codes
- [ ] **Expense Categories**: Categorize bills and expenses

---

**Built with ❤️ for the community. Star ⭐ this repo if you found it helpful!**
