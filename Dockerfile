ARG NODE_VERSION=20.13.1-alpine

# Base
FROM node:${NODE_VERSION} as base

# Create app directory
WORKDIR /usr/src/veritify

# Dependencies Production
FROM base As deps

# Install app dependencies using the `npm ci` command instead of `npm install`
COPY package.json package-lock.json ./
RUN npm ci --omit=dev 

# Build
FROM base as build

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Copia la carpeta assets a la imagen Docker
COPY ./assets ./dist/assets

# Run the build command which creates the production bundle
RUN npm run build

# Final
FROM base as final

# Set NODE_ENV environment variable
ENV NODE_ENV=prod

RUN apk add --no-cache curl

# Copy package.json
COPY package.json ./

# Copy node_modules from dependencies stage
COPY --from=deps /usr/src/veritify/node_modules ./node_modules

# Copy built files from build stage
COPY --from=build /usr/src/veritify/dist ./dist

# Ensure the /usr/src/veritify directory exists
RUN mkdir -p /usr/src/veritify

# Debugging step: List the directory permissions
RUN ls -l /usr/src/veritify

# Setting port
EXPOSE 5000

# Start the server using the production build, with a wait-for-it script
CMD ["npm", "run", "start:prod"]
