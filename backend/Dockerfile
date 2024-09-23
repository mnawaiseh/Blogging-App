# Use the official Node.js image as the base
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Generate the Prisma client with binaries
RUN npx prisma generate

# Expose the backend port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]
