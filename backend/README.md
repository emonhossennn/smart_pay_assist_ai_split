# SmartPay Backend

Django REST API backend for the SmartPay bill splitting application.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
copy .env.example .env
```

Edit the `.env` file with your specific configuration.

### 3. Database Setup

For development with SQLite (default):
```bash
python manage.py migrate --settings=smartpay_backend.settings.development
```

For PostgreSQL:
1. Install PostgreSQL
2. Create database: `smartpay_db`
3. Update `.env` with database credentials
4. Set `USE_SQLITE=False` in `.env`
5. Run migrations:
```bash
python manage.py migrate --settings=smartpay_backend.settings.development
```

### 4. Create Superuser

```bash
python manage.py createsuperuser --settings=smartpay_backend.settings.development
```

### 5. Run Development Server

```bash
python manage.py runserver --settings=smartpay_backend.settings.development
```

The API will be available at: http://localhost:8000/

### 6. API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/api/docs/
- API Schema: http://localhost:8000/api/schema/

## Docker Setup

### Development with Docker Compose
LIVE- https://smart-pay-assist-ai-split-e4qo.vercel.app/
```bash
docker-compose up --build
```

This will start:
- Django application on port 8000
- PostgreSQL database on port 5432
- Redis on port 6379
- Celery worker for background tasks

## Project Structure

```
backend/
├── apps/                   # Django applications
│   ├── authentication/    # User auth and JWT
│   ├── users/             # User profiles
│   ├── bills/             # Bill management
│   ├── payments/          # Payment processing
│   ├── notifications/     # User notifications
│   └── core/              # Shared utilities
├── smartpay_backend/      # Main Django project
│   ├── settings/          # Environment-specific settings
│   ├── urls.py           # Main URL configuration
│   └── celery.py         # Celery configuration
├── static/               # Static files
├── media/                # User uploaded files
└── logs/                 # Application logs
```

## API Endpoints

The API follows RESTful conventions with the following main endpoints:

- `/api/auth/` - Authentication (register, login, refresh)
- `/api/users/` - User management and profiles
- `/api/bills/` - Bill creation and management
- `/api/payments/` - Payment processing and tracking
- `/api/notifications/` - User notifications

## Development Notes

- The project uses Django REST Framework for API development
- JWT tokens are used for authentication
- Celery is configured for background tasks (receipt processing, notifications)
- PostgreSQL is recommended for production, SQLite for development
- Redis is used for caching and Celery message broker

## Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Configure environment variables in `.env`
3. Run migrations to set up the database
4. Start implementing the authentication system (Task 2)
