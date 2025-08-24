# SmartPay Assist AI Split

SmartPay Assist AI Split is a full-stack bill splitting application consisting of a Django REST backend and a React/TypeScript frontend.

## Getting Started

### Backend

The backend lives in [`backend/`](backend/). Refer to its [README](backend/README.md) for detailed setup instructions. A quick start:

```bash
cd backend
pip install -r requirements.txt
USE_SQLITE=True python manage.py migrate --settings=smartpay_backend.settings.development
python manage.py runserver --settings=smartpay_backend.settings.development
```

### Frontend

The frontend lives in [`project/`](project/):

```bash
cd project
npm install
npm run dev
```

## Testing

Run the backend test suite:

```bash
cd backend
USE_SQLITE=True python manage.py test apps.authentication.tests --settings=smartpay_backend.settings.development -v 2
```

## Project Structure

```
.
├── backend/   # Django REST API
└── project/   # React + Vite frontend
```

## Features

- Custom email-based user model with JWT authentication
- REST API endpoints for user registration and login
- React frontend scaffolded with Vite and Tailwind CSS
