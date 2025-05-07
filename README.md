<h1 align="center">Dudes</h1>
<div align="center">
  <a
  href="https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/inferst/dudes">
    <img
    src="https://img.shields.io/static/v1?style=for-the-badge&logo=docker&label=devcontainer&message=supported&color=0797ff&labelColor=000000"
    alt="Dev Containers Badge"
    />
  </a>
</div>

<img
src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_83ffd63c128c4fbc86784ff2914836a9/default/dark/4.0"
width="100px"
align="right"
/>

Animated characters for chatters in your stream.




# Run the database in docker

```shell
docker compose -f compose.dev.yaml up -d
```

> [!WARNING]
> By default, PostgreSQL runs on port `5432`. Before starting, ensure this port is not already in use on your system.

To change the PostgreSQL port, use the following command structure:
```shell
docker compose -f compose.dev.yaml run -d -p <port>:5432
```

# Run locally

> [!IMPORTANT]
> You need [node](https://nodejs.org/en/download/package-manager) installed.

1. Copy environment variables and update them
    ```shell
    cp .env.example .env
    ```
2. Install and run postgres

    You can install [PostgreSQL](https://www.postgresql.org/download/) directly on your system or use Docker. For Docker instructions, refer to [Run the database in docker](<#run-the-database-in-docker>).
3. Install pnpm
    ```shell
    npm install -g pnpm
    ```
4. Install dependencies
    ```shell
    pnpm install
    ```
5. Generate schema and migrate
    ```shell
    pnpm run db:migrate:dev
    ```
6. Fill the database with data
    ```shell
    pnpm run db:seed
    ```
7. Start the server
    ```shell
    pnpm run dev
    ```

# Ports

- http://localhost - website
- http://localhost/api - admin panel backend
- http://localhost/admin - admin panel frontend
- http://localhost/client - client

# Run the linter

```shell
pnpm run lint
```

