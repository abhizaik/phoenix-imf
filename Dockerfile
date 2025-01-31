FROM node:20-alpine

WORKDIR /app

# Install build tools and Python
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g npm@latest && \
    npm install --production

# Copy Prisma files
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]