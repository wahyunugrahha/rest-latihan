# RESTful API Express

This is a practice repository for building a RESTful API using Express.js, integrated with Swagger for API documentation and Prisma for database interactions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [License](#license)

## Features

This API provides comprehensive management for users, contacts, and addresses, including:

**User Management:**

- User registration
- User login with JWT authentication
- Retrieving current user profile
- Updating user name and password
- User logout

**Contact Management:**

- Creating new contacts
- Retrieving contact details by ID
- Updating existing contacts
- Deleting contacts
- Searching contacts by name, email, or phone with pagination

**Address Management:**

- Creating new addresses for a specific contact
- Retrieving address details by ID for a contact
- Updating existing addresses for a contact
- Deleting addresses for a contact
- Listing all addresses for a specific contact

**Additional Features:**

- Centralized error handling for consistent API responses
- Basic logging for application events and queries
- Interactive API documentation using Swagger UI

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **Joi**: Schema description and validation library
- **Bcrypt**: Library for hashing passwords
- **JSON Web Token (JWT)**: For secure authentication
- **Swagger-JSDoc & Swagger-UI-Express**: For OpenAPI documentation
- **Winston**: Logging library
- **PostgreSQL**: Relational database

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (>= 18.14.0)
- npm (or yarn)
- PostgreSQL database instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wahyunugrahha/RESTful-API-ExpressJS
   cd rest-latihan/rest-latihan-add-swagger-docs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"
   JWT_SECRET="your_super_secret_jwt_key"
   ```

4. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

   If you encounter issues:

   ```bash
   npx prisma generate
   ```

### Running the Application

Start the development server:

```bash
npm start
```

Visit the application at:

```
http://localhost:3000/
```

### Running Tests

Execute the test suite:

```bash
npm test
```

## API Documentation

The Swagger UI is available at:

```
http://localhost:3000/api-docs
```

It provides interactive access to all available endpoints and request/response formats.

## Database Schema

The project uses Prisma for database management with the following tables:

**users**

- `username` VARCHAR(100), PK, NOT NULL
- `password` VARCHAR(100), NOT NULL
- `name` VARCHAR(100), NOT NULL

**contacts**

- `id` SERIAL, PK, NOT NULL
- `first_name` VARCHAR(100), NOT NULL
- `last_name` VARCHAR(100), NULL
- `email` VARCHAR(100), NULL
- `phone` VARCHAR(20), NULL
- `username` VARCHAR(100), FK, NOT NULL (links to users)

**addresses**

- `id` SERIAL, PK, NOT NULL
- `street` VARCHAR(256), NULL
- `city` VARCHAR(100), NULL
- `province` VARCHAR(100), NULL
- `country` VARCHAR(100), NOT NULL
- `postal_code` VARCHAR(10), NOT NULL
- `contact_id` INTEGER, FK, NOT NULL (links to contacts)

Refer to `prisma/schema.prisma` and `prisma/migrations/` for full schema definitions.

## Project Structure

```
.
├── src/
│   ├── application/       # Express app setup, DB connection, logging
│   ├── controller/        # API route handlers
│   ├── error/             # Custom error classes
│   ├── middleware/        # Middleware for auth and error handling
│   ├── routes/            # Route definitions
│   ├── service/           # Business logic
│   ├── test/              # Unit and integration tests
│   ├── validation/        # Joi schemas
│   └── main.js            # App entry point
├── prisma/                # Prisma files
│   ├── migrations/        # Migration SQL files
│   └── migration_lock.toml
├── docs/                  # Swagger YAML definition
├── .gitignore             # Git ignore file
├── babel.config.json      # Babel configuration
├── package.json           # Project metadata
├── package-lock.json      # Dependency lock
└── README.md              # This file
```

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

