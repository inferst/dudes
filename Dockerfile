FROM node:20-alpine
ENV VITE_CLIENT_SOCKET_HOST = $VITE_CLIENT_SOCKET_HOST
ENV VITE_CJS_IGNORE_WARNING = $VITE_CJS_IGNORE_WARNING
ENV VITE_API_URL = $VITE_API_URL
WORKDIR /usr/src/dudes
COPY . /usr/src/dudes
RUN npm install -g pnpm
RUN pnpm install
RUN npx nx reset
RUN pnpm run build
