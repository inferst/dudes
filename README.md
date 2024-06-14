# Dudes

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/inferst/dudes)

Animated characters for chatters in your stream.

Before the installation: check that default port 5432 has not been used

## Set-up the app

1. Copy env `cp .env.example .env`
2. Run `docker compose -f docker-compose.development.yaml up -d`
3. Run `npm install -g pnpm`
4. Run `pnpm install`
5. Run `pnpm exec nx reset`

## Run scheme generation

Run `pnpm run db:generate`

## Run migration

Run `pnpm run db:migrate:dev`

## Run seed

Run `pnpm run db:seed`

## Start the app

Run `pnpm run dev`

http://localhost:3000 - admin panel backend

http://localhost:4200 - admin panel frontend

http://localhost:4300 - client

## Linters

Run `pnpm run lint`
