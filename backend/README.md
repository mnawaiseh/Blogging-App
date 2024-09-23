# Blogs App - Backend

The **Blogs App** backend is built using **Express.js** and **Prisma** ORM, providing a robust API for handling user authentication, blog post management, and engagement features like likes and comments.

## Key Features

- **User Authentication**: Secure login and registration system using JWT.
- **Post Management**: Create, update, view, and delete blog posts.
- **Likes and Comments**: Users can like and comment on blog posts.
- **Database**: Uses **PostgreSQL** managed by **Prisma** ORM.
- **RESTful API**: Provides a structured and scalable API for frontend consumption.

## Getting Started

### Prerequisites

Before running the backend service, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)

### Environment Variables

To run the backend, you'll need to configure environment variables. Create a `.env` file in the root directory with the following keys:

```bash
DATABASE_URL=postgresql://username:password@dbhost:port/database
JWT_SECRET=your_jwt_secret
PORT=4000
```

- **DATABASE_URL**: The connection string for your PostgreSQL database.
- **JWT_SECRET**: A secret key used for signing JWTs.
- **PORT**: The port on which the Express server will run (default: 4000).

### Running the Backend with Docker

#### 1. Build the Docker Image

Run the following command to build the Docker image:

```bash
docker build -t backend .
```

This command will create a Docker image named `backend`.

#### 2. Run the Docker Container

After building the image, run the container:

```bash
docker run -p 4000:4000 backend
```

The backend will be accessible on port `4000` of your local machine at [http://localhost:4000](http://localhost:4000).


This will spin up both the PostgreSQL database and your backend service in Docker containers, and the backend will be accessible at [http://localhost:4000](http://localhost:4000).

### Running Migrations with Prisma

If you need to apply migrations for the database schema, use the following commands after connecting to the running container:

```bash
npx prisma migrate dev
```

This command will apply the latest migrations to your PostgreSQL database.

### Available Scripts

In the project directory, you can also run:

#### `npm run dev`

Compiles the TypeScript code for production.

#### `npx run lint`

Runs ESLint to check for code issues.

#### `npm run test`

Runs the test suite for the backend.

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs) - Learn about using Prisma ORM.
- [Express.js Documentation](https://expressjs.com/) - Learn more about Express.js for building APIs.
- [Docker Documentation](https://docs.docker.com/) - Learn more about containerizing applications with Docker.

---

This `README.md` includes detailed instructions to run the **Express.js** backend with **Prisma** and PostgreSQL using Docker and Docker Compose.