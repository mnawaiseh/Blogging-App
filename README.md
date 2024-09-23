# Blogging-App - Fullstack Application

This project is a fullstack application built using **Next.js** for the frontend and **Node.js** with **Express** and **Prisma** for the backend. The frontend and backend communicate seamlessly to provide a platform where users can log in, create posts, engage with content through likes and comments, and perform other blogging functionalities.

## Prerequisites
Before running the project, make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Optional: Node.js (if you plan to run the services outside of Docker)
- [System Design](https://docs.google.com/document/d/1TjnMyZdgLWhijLjOvnasfNG48HZxS45iFxsQbgws1ao/edit?usp=sharing)


## Running the Project Using Docker Compose

### Steps to Run

1. Clone the repository:

   ```bash
   git clone git@github.com:mnawaiseh/Blogging-App.git
   cd blogging-app
   ```

2. Ensure that you have a `.env` file in the **root** **backend** directory.
   - **Backend**:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `PORT`

3. Build and run the services:

   ```bash
   docker-compose up --build
   ```

   This command will build and start both the frontend and backend services.

4. Open your browser and visit:

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API** (optional): [http://localhost:4000/api](http://localhost:4000/api)

### Stopping the Services

To stop the running containers, run:

```bash
docker-compose down
```

This will stop and remove the containers but retain the images.

## Docker Compose Configuration

The `docker-compose.yml` file defines the setup for both the frontend and backend services. Below is a brief overview:

- **Frontend Service**: Runs a Next.js application in a Docker container, exposing port `3000` to the host.
- **Backend Service**: Runs an Express server with Prisma connected to a PostgreSQL database, exposing port `4000` to the host.


By following these steps, you can seamlessly run both the frontend and backend services using Docker Compose. Enjoy building and managing your blogging platform!
