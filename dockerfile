FROM node:18-alpine AS base
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# development stage
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
CMD [ "pnpm", "run", "start:dev" ]

# build stage
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

# production stage
FROM base AS deploy
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD [ "node", "dist/main.js" ]