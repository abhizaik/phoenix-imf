# IMF Gadget Management System

A secure REST API system for managing IMF's top-secret gadgets. This system helps track, deploy, and manage various gadgets used in field operations.

## Features

- **User Authentication**: Secure signup and login system
- **Gadget Management**: Create, update, and track gadgets
- **Special Operations**: Self-destruct and decommission features
- **Status Tracking**: Monitor gadget status

## Installation (Using Docker)

1. Clone the repository:
```bash
git clone https://github.com/abhizaik/phoenix-imf.git
cd phoenix-imf
```

2. Create .env file in root directory:
```env
NODE_ENV=development
POSTGRES_USER=imf
POSTGRES_PASSWORD=secret
POSTGRES_DB=imf_database
DATABASE_URL=postgresql://imf:secret@db:5432/imf_database?schema=public
JWT_SECRET=someSuperSecret
JWT_EXPIRES_IN=1d
PORT=3000
```

3. Build and start containers:
```bash
docker-compose up --build
```

4. Run database migrations:
```bash
docker-compose exec app npx prisma migrate dev --name init
```


## API Documentation

Postman Documentation: https://documenter.getpostman.com/view/41653874/2sAYX3phYR

## Authentication

All gadget endpoints require authentication. Include the JWT token in your request headers:

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Login to existing account
- `POST /api/v1/auth/logout` - Logout current session

### Gadgets
- `GET /api/v1/gadgets` - Get all gadgets
- `POST /api/v1/gadgets` - Create new gadget
- `PATCH /api/v1/gadgets/:id` - Update gadget
- `POST /api/v1/gadgets/:id/self-destruct` - Initiate self-destruct sequence
- `DELETE /api/v1/gadgets/:id` - Decommission gadget




