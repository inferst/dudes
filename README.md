<h1 align="center">Evotars</h1>
<div align="center">
  <a
  href="https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/inferst/evotars">
    <img
    src="https://img.shields.io/static/v1?style=for-the-badge&logo=docker&label=devcontainer&message=supported&color=0797ff&labelColor=000000"
    alt="Dev Containers Badge"
    />
  </a>
</div>

# Overview

Evotars is a simple and free web-based overlay that adds animated avatars for your Twitch chatters. It's a lightweight alternative to Stream Avatars, designed with accessibility and ease of use in mind. Perfect for small or new streamers who want to add some fun interactivity to their streams without complex setup or extra software.

## Features
* Animated avatars for chatters in your stream
* Chat commands: !jump, !dash, !color
* Channel point reward integration
* Separate display of 7tv emotes
* Falling avatars triggered by raids
* Web-based — no installation required

## How to Use
1. Go to https://evotars.inferst.com
2. Log in with your Twitch account
3. Customize your settings
4. Copy your unique overlay URL
5. Add it to OBS as a Browser Source

# Development

## Run the database in docker

```shell
docker compose -f compose.dev.yaml up -d
```

> [!WARNING]
> By default, PostgreSQL runs on port `5432`. Before starting, ensure this port is not already in use on your system.

To change the PostgreSQL port, use the following command structure:
```shell
docker compose -f compose.dev.yaml run -d -p <port>:5432
```

## Run locally

> [!IMPORTANT]
> You need to have [Node.js](https://nodejs.org/en/download/package-manager) installed.

1. Copy the environment variables file and update it
    ```shell
    cp .env.example .env
    ```
2. Install and run PostgreSQL

    You can install [PostgreSQL](https://www.postgresql.org/download/) directly on your system or use Docker. For Docker instructions, refer to [Run the database in docker](<#run-the-database-in-docker>).
3. Install pnpm
    ```shell
    npm install -g pnpm
    ```
4. Install dependencies
    ```shell
    pnpm install
    ```
5. Generate the schema and run migrations
    ```shell
    pnpm run db:migrate:dev
    ```
6. Seed the database with initial data
    ```shell
    pnpm run db:seed
    ```
7. Start the server
    ```shell
    pnpm run dev
    ```

## Links

- http://localhost - website
- http://localhost/api - api
- http://localhost/admin - admin panel
- http://localhost/client - client overlay

## Run the linter

```shell
pnpm run lint
```

# Contributors

<a href="https://github.com/inferst/evotars-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=inferst/evotars-app" />
</a>
