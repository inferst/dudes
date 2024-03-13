FROM node:20-alpine
WORKDIR /usr/src/dudes
COPY . /usr/src/dudes
RUN npm install -g pnpm
RUN pnpm install -P
RUN npx nx reset
RUN pnpm run build
