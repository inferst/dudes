FROM node:20-alpine
WORKDIR /usr/src/dudes
COPY . /usr/src/dudes
RUN npm config set fetch-retry-maxtimeout 60000
RUN npm install
RUN npx nx reset
RUN npm run build
