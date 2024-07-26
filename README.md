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

# Develop in devcontainer

> [!IMPORTANT]
> You need the [docker](https://docs.docker.com/get-docker/) installed and running.

Just install the [extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) and build it lol.

In the development container, you'll have access to `docker` and a convenient alias `dudes`. This alias executes `docker compose -p dudes -f docker-compose.development.yaml`, streamlining your workflow.

For example, to view the logs in real time:
```shell
dudes logs -f
```

> [!TIP]
> If you need your favorite extensions in the devcontainer, you can use the [defaultExtensions](https://code.visualstudio.com/docs/devcontainers/containers#_always-installed-extensions) option in VS Code.

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

1. Copy environment variables
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

- http://localhost:3000 - admin panel backend
- http://localhost:4200 - admin panel frontend
- http://localhost:4300 - client

# Database Connection

To connect to the PostgreSQL database, use the following credentials:

- **Host**: localhost
- **Port**: 5432
- **Database**: dudes
- **Username**: dudes
- **Password**: dudes

> [!TIP]
> If you use Visual Studio Code, consider installing the [PostgreSQL extension](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres) for easier database management.

# Run the linter

```shell
pnpm run lint
```

