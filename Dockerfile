FROM node:lts
WORKDIR /usr/src/dudes
COPY . /usr/src/dudes
RUN npm install
RUN npx nx reset
RUN npm run build
