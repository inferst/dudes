# Dudes

Animated characters for chatters in your stream.

## Run migration

Run `pnpm run db:migrate:dev`

## Run seed

Run `pnpm run db:seed`

## Start the app

1. Copy env `cp .env.example .env`
2. Run `docker compose up -f docker-compose.development.yaml up -d`
3. Run `pnpm run dev`

http://localhost:3000 - admin panel backend

http://localhost:4200 - admin panel frontend

http://localhost:4300 - client

## Linters

Run `pnpm run lint`
