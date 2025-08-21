# Design Document

## Overview

The Django backend will be built as a REST API server that provides comprehensive support for the SmartPay Assist AI frontend. The architecture follows Django best practices with a modular app structure, using Django REST Framework for API endpoints, Celery for background tasks, and PostgreSQL for data persistence. The system integrates with external services including OCR/AI for receipt processing and SSLCommerce for payment processing.

## Architecture

### System Architecture
```
Frontend (React) <-> REST API (Django) <-> Database (PostgreSQL)
                         |
                    Background Tasks (Celery + Redis)
                         |
                External Services (OCR API, SSLCommerce)
```

### Django Project Structure
```
smartpay_backend/
├── manage.py
├── requirements.txt
├── smartpay_backend/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── authentication/
│   ├── users/
│   ├── bills/
│   ├── payments/
│   └── notifications/
└── static/
└── media/
```

## Components and Interfaces

### 1. Authentication App
**Purpose:** Handle user registration, login, and JWT token management

**Models:**
- Extends Django's built-in User model with custom fields
- UserProfile model for additional user information

**API Endpoints:**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh
- `POST /api/auth/logout/` - User logout

### 2. Users App
**Purpose:** Manage user profiles and relationships

**Models:**
- UserProfile (avatar, preferences, notification settings)
- UserConnection (friend relationships)

**API Endpoints:**
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/search/` - Search users by email/name

### 3. Bills App
**Purpose:** Core bill management and splitting logic

**Models:**
- Bill (title, total_amount, status, created_at, created_by)
- BillItem (name, price, bill, assigned_users)
- BillParticipant (bill, user, role)
- ReceiptImage (bill, image_file, processed_data)

**API Endpoints:**
- `GET /api/bills/` - List user's bills
- `POST /api/bills/` - Create new bill
- `GET /api/bills/{id}/` - Get bill details
- `PUT /api/bills/{id}/` - Update bill
- `POST /api/bills/{id}/process-receipt/` - Upload and process receipt
- `POST /api/bills/{id}/generate-splits/` - Generate payment splits

### 4. Payments App
**Purpose:** Handle payment processing and tracking

**Models:**
- Payment (bill, user, amount, status, due_date, paid_at)
- PaymentTransaction (payment, transaction_id, gateway_response)

**API Endpoints:**
- `GET /api/payments/` - List user's payments
- `POST /api/payments/{id}/initiate/` - Initiate SSLCommerce payment
- `POST /api/payments/webhook/` - SSLCommerce webhook handler
- `GET /api/payments/dashboard/` - Payment dashboard data

### 5. Notifications App
**Purpose:** Manage user notifications and preferences

**Models:**
- Notification (user, type, title, message, read, created_at)
- NotificationPreference (user, email_enabled, push_enabled)

**API Endpoints:**
- `GET /api/notifications/` - List user notifications
- `PUT /api/notifications/{id}/read/` - Mark notification as read
- `GET /api/notifications/preferences/` - Get notification preferences
- `PUT /api/notifications/preferences/` - Update preferences

## Data Models

### Core Models Schema

```python
# Bills App Models
class Bill(models.Model):
    title = models.CharField(max_length=200)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(choices=[
        ('processing', 'Processing'),
        ('split', 'Split'),
        ('partial', 'Partially Paid'),
        ('paid', 'Fully Paid')
    ])
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User, through='BillParticipant')

class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    assigned_users = models.ManyToManyField(User, blank=True)

class Payment(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ])
    due_date = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)
```

### Database Relationships
- Users can participate in multiple Bills (Many-to-Many through BillParticipant)
- Bills contain multiple BillItems (One-to-Many)
- BillItems can be assigned to multiple Users (Many-to-Many)
- Users have multiple Payments (One-to-Many)
- Bills have multiple Payments (One-to-Many)

## External Service Integration

### OCR/AI Receipt Processing
**Service:** Google Vision API or AWS Textract
**Implementation:**
- Celery background task for image processing
- Structured data extraction for items and prices
- Fallback to manual entry if processing fails

### SSLCommerce Payment Gateway
**Integration Points:**
- Payment initiation API
- Webhook handling for payment status updates
- Transaction verification and reconciliation

**Security Measures:**
- API key authentication
- Webhook signature verification
- Transaction amount validation

## Error Handling

### API Error Responses
```python
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "field_name": ["Error message"]
        }
    }
}
```

### Error Categories
1. **Validation Errors (400)** - Invalid input data
2. **Authentication Errors (401)** - Invalid or missing tokens
3. **Permission Errors (403)** - Insufficient permissions
4. **Not Found Errors (404)** - Resource not found
5. **Server Errors (500)** - Internal server errors

### Logging Strategy
- Structured logging with JSON format
- Error tracking with Sentry integration
- Performance monitoring for API endpoints
- Security event logging

## Testing Strategy

### Unit Tests
- Model validation and business logic
- Serializer validation
- Utility function testing
- Service integration testing

### Integration Tests
- API endpoint testing
- Database transaction testing
- External service mocking
- Authentication flow testing

### Test Coverage Requirements
- Minimum 90% code coverage
- Critical path testing for payment flows
- Edge case testing for bill splitting logic
- Security testing for authentication

### Testing Tools
- Django TestCase and APITestCase
- Factory Boy for test data generation
- Mock for external service testing
- Coverage.py for coverage reporting

## Security Considerations

### Authentication & Authorization
- JWT tokens with short expiration times
- Refresh token rotation
- Role-based access control for bill management
- API rate limiting per user

### Data Protection
- Password hashing with Django's PBKDF2
- Sensitive data encryption at rest
- HTTPS enforcement for all endpoints
- Input validation and sanitization

### Payment Security
- PCI DSS compliance considerations
- Secure webhook handling
- Transaction verification
- Audit logging for financial operations

## Performance Optimization

### Database Optimization
- Proper indexing on frequently queried fields
- Query optimization with select_related and prefetch_related
- Database connection pooling
- Read replica for reporting queries

### Caching Strategy
- Redis for session storage and caching
- API response caching for static data
- Database query result caching
- CDN for static file serving

### Background Processing
- Celery for asynchronous tasks
- Receipt processing in background
- Email notifications in background
- Payment status polling

## Deployment Architecture

### Development Environment
- Docker containers for consistent development
- PostgreSQL database
- Redis for caching and Celery
- Local file storage for development

### Production Environment
- AWS/DigitalOcean deployment
- PostgreSQL RDS or managed database
- Redis cluster for high availability
- S3 or similar for file storage
- Load balancer for multiple app instances

### Environment Configuration
- Separate settings files for each environment
- Environment variables for sensitive configuration
- Database migration strategy
- Static file serving configuration