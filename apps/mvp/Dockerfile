# Build the MVP app into a static bundle and serve it.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
ENV HOST=0.0.0.0
ENV PORT=4174
EXPOSE 4174
CMD ["sh", "-c", "serve -s dist -l ${PORT:-4174}"]
