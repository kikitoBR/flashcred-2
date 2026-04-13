# Step 1: Build the React application
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:stable-alpine as production-stage

# Copy the build output to the nginx document root
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
