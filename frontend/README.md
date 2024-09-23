# Blogs App - Frontend

Blogs App is a platform where users can log in to share their thoughts, ideas, and experiences. Built with Next.js, it provides an intuitive and user-friendly interface for creating and engaging with blog posts.

## Key Features

- User Authentication: Login and registration system to manage user accounts.
- Post Management: Create, update, view, and delete blog posts.
- Engagement: Users can like and comment on posts.
- Responsive Design: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/) to run the application using Docker.

### Steps to Run the Project Using Docker

#### 1. Build the Docker Image

Open a terminal in the root directory (where the `Dockerfile` is located), and run the following command to build the Docker image:

```bash
docker build -t frontend .
```

This will create a Docker image named `frontend`.

#### 2. Run the Docker Container

After the image is built, you can run the container with the following command:

```bash
docker run -p 3000:3000 frontend
```

This command starts the Next.js frontend inside the Docker container, and maps port `3000` of the container to port `3000` on your local machine. You can then access the application at [http://localhost:3000](http://localhost:3000).


### Other Available Scripts

In the project directory, you can also run:

#### `npm run build`

Builds the app for production in the `.next` folder. It optimizes the build for the best performance.

#### `npm run dev`

Runs the Next.js app in production mode. It should be executed after running `npm run build`.

#### `npm run lint`

Runs the linter to analyze the code for potential errors and issues.

#### `npm run test`

Runs the test suite to check for potential bugs and ensure that everything is functioning as expected.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

This updated `README.md` now includes instructions to run the Next.js frontend using Docker and Docker Compose.