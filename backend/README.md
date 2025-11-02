# Ledge API

The **Ledge API** is the backend service responsible for authentication and transaction management within the Ledge budgeting application.  
It provides a simple and secure REST interface used exclusively by the Ledge front-end.

This service handles user registration, login, and token refresh using **JWTs** and **refresh tokens** stored in HTTP-only cookies.  
JWTs expire after 15 minutes, while refresh tokens are persisted in the database to allow session invalidation when needed.

In addition to authentication, the API exposes CRUD endpoints for **user transactions**, allowing each user to manage their own financial records.  
There is no administrative interface — the API is designed for individual use only.

The project aims for **simplicity and maintainability** rather than feature bloat.  
It runs as part of a Dockerized stack including the React front-end, a MongoDB database, and Mailpit for local email testing.

## Technical Stack

The backend is built with **Node.js**, **Express**, and **TypeScript**, providing a lightweight and maintainable foundation for the REST API.  
All services are containerized and orchestrated via **Docker Compose**.

### Core technologies

- **Node.js** – Runtime environment for executing JavaScript on the server.
- **Express** – Web framework used to define routes, controllers, and middlewares.
- **TypeScript** – Static typing for improved reliability and maintainability.

### Supporting tools

- **MongoDB** – Primary database used to store users, transactions, and refresh tokens.
- **Mailpit** – Local SMTP server used during development for testing outgoing emails.
- **Jest** – Unit testing framework ensuring code correctness and stability.
- **ESLint** & **Prettier** – Code quality and formatting tools used across the project.

The backend runs as part of a Dockerized environment that also includes the React front-end and database services.  
All dependencies and interactions between containers are defined in the `compose.yaml` file.
=

## Project Structure

The source code follows a layered architecture, promoting clear separation of concerns and maintainability.

```

src/
├── domain/             # Business logic layer
├── application/        # Use cases
├── infrastructure/     # External services, configurations, and HTTP server
├── presentation/       # Express routes and controllers
└── __tests__/          # Unit and integration tests

```

Each layer has a dedicated responsibility, allowing the codebase to evolve and scale without tight coupling between modules.

## API Documentation

The API is documented using **Swagger (OpenAPI 3.0)**, providing an interactive interface to explore and test all available endpoints.  
The documentation is automatically generated from JSDoc comments located in the route files under:

```

src/presentation/*/*-routes.ts

```

### Access

When the backend is running in development mode, the Swagger UI is available at:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Each endpoint includes details about:

- Request body and parameters
- Response formats and status codes
- Example payloads

Swagger is only loaded in development environments and is not exposed in production.

## Testing

Unit tests are written with **Jest** to ensure reliability and maintain code quality over time.  
Tests cover core services, authentication flows, and application logic.

```

src/__tests__/

```

### Running tests

To execute the test suite locally:

```bash
npm run test
```

All new features or bug fixes should include appropriate test coverage to maintain overall project stability.

## Configuration

Environment variables are managed through a `.env` file located in the project root.  
A ready-to-use template is provided for local development:

```bash
cp .env.example .env
```

The default values in `.env.example` are configured to work seamlessly with the local Docker environment,
including the database connection and Mailpit setup.

No manual configuration is required unless you modify service names or ports in `compose.yaml`.

## Code Style & Tooling

The project enforces consistent coding standards through the following tools:

- **TypeScript** with strict type checking enabled
- **ESLint** for linting and best practices
- **Prettier** for automatic code formatting
- **Jest** for unit and integration testing

All linting and formatting rules are automatically applied through the project's configuration files.  
Developers are encouraged to run these tools before committing changes:

```bash
npm run lint
npm run format
```

This ensures that the codebase remains clean, readable, and consistent across all contributors.
