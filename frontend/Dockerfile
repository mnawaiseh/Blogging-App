# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
