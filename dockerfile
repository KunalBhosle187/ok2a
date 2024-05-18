# Dockerfile
# preferred node version chosen here (LTS = 18.18 as of 10/10/23)
FROM node:latest

# Create the directory on the node image
# where our Next.js app will live
RUN mkdir -p /ok2a

# Set /app as the working directory in container
WORKDIR /ok2a

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json ./

# Install dependencies in /ok2a
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY . .

# Ensure port 3000 is accessible to our systems
EXPOSE 3000

RUN npm run build
# Run dev, as we would via the command line
CMD ["next", "start"]