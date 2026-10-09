# Deployment and Configuration

## Frontend

The existing Vercel project must continue using `frontend` as its root directory. The current Express-based Gemini endpoint and `GEMINI_API_KEY` configuration are unchanged.

## Backend

Deploy `HoneyAn.Api` to a host that supports ASP.NET Core 9. Set these environment variables in the hosting platform:

- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=<PostgreSQL connection string>`
- `Cors__AllowedOrigins__0=<deployed frontend origin>`
- `Jwt__SigningKey=<random secret of at least 32 bytes>`
- `AuthCookie__Secure=true`
- `AuthCookie__SameSite=Strict` for same-site deployment, or `None` only for an intentional cross-site HTTPS deployment

Publish with:

```powershell
dotnet publish backend/src/HoneyAn.Api/HoneyAn.Api.csproj -c Release -o publish
```

Run migrations as an explicit deployment step; the application never applies them automatically. Database provisioning, secret management, TLS policy, telemetry, and the production hosting provider remain deployment decisions. Health currently reports process liveness rather than database readiness.

Run `--seed` as an explicit one-off release job after migration. Running it repeatedly is safe: roles are created only when absent, an existing Admin is not duplicated, and existing passwords are never overwritten. Inject `HONEYAN_SEED_ADMIN_EMAIL`, `HONEYAN_SEED_ADMIN_DISPLAY_NAME`, and `HONEYAN_SEED_ADMIN_PASSWORD` from the platform secret store only when an initial Admin must be provisioned.
