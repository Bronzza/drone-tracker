# Stage 1: Build the React app
FROM node:16-alpine as build

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app files to the container
COPY . .

#If we want to pass variable for url on docker file stage. find it not that flexible approach so we are going to pass this variable by docker-compose yml env variable
# ARG REACT_APP_API_BASE_URL
# ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will serve the app on
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
