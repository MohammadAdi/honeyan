# Local Development

## Prerequisites

- .NET SDK 9.0.300 or a compatible newer 9.0 feature band
- PostgreSQL
- Node.js 20 or newer and Yarn 1.22.22

## Backend

The development profile uses PostgreSQL database `honeyandb` on `localhost:5432` with local user `postgres`. Supply the password through an environment variable; credentials are never tracked:

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=honeyandb;Username=postgres;Password=<local-password>"
dotnet run --project backend/src/HoneyAn.Api
```

Build and test the full solution:

```powershell
dotnet restore backend/HoneyAn.sln
dotnet build backend/HoneyAn.sln --no-restore
dotnet test backend/HoneyAn.sln --no-build
```

Apply the versioned Identity schema migration after creating `honeyandb`:

```powershell
dotnet ef database update --project backend/src/HoneyAn.Infrastructure --startup-project backend/src/HoneyAn.Api
```

Provision the first Admin exactly once. The command refuses to run after an Admin exists:

```powershell
$env:HONEYAN_BOOTSTRAP_EMAIL = "admin@example.invalid"
$env:HONEYAN_BOOTSTRAP_DISPLAY_NAME = "Initial Admin"
$env:HONEYAN_BOOTSTRAP_PASSWORD = "use-a-strong-secret"
dotnet run --project backend/src/HoneyAn.Api -- --bootstrap-admin
```

Never commit bootstrap values or production connection/JWT secrets.

## Frontend

```powershell
Set-Location frontend
yarn install --frozen-lockfile
yarn dev
```

The frontend has its own Vercel configuration and remains independently deployable.

For local development, Vite proxies `/api/v1` to `http://localhost:5151`. Set `VITE_API_URL` to the deployed backend origin for production builds.
