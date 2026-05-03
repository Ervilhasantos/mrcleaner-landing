# Stage 1: Build the React application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Change default Nginx port from 80 to 3000
RUN sed -i 's/listen  *80;/listen 3000;/g' /etc/nginx/conf.d/default.conf
RUN sed -i 's/listen  *\[::\]:80;/listen [::]:3000;/g' /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
