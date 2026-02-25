FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package*.json ./

# Copy all workspace package.json files
COPY packages/arya-design-system/package.json packages/arya-design-system/
COPY packages/empsurvey/package.json packages/empsurvey/

# Install dependencies with workspace support
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

CMD ["npm", "-w", "@arya/design-system", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
