# Base setup
- npm install
- npm install immutable

<b>Note: if you have an old version of the application, do the following:</b>

- dotnet restore
- dotnet build

# Database setup
- Install Postgres from https://www.postgresql.org/
- Install a GUI for the database such as PgAdmin4

<b>Note: if you have a database with the old version before the clean install, please use 'dotnet ef database drop' before the next step</b>

- dotnet ef database update

# Run the application
- ASPNETCORE_ENVIRONMENT=development dotnet run
