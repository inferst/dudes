FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

RUN apt-get -y update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install git gnupg2

RUN npm install -g pnpm

RUN pnpm fetch

