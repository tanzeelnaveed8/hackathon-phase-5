# Frontend: Node.js (React/Next)
FROM node:20-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining code
COPY . .

# Build production version
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start frontend
CMD ["npm","start"]
