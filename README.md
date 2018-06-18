# Base setup
- npm install

<b>Note: if you have an old version of the application, do the following before building:</b>
- dotnet restore

- dotnet build

# Database setup
- Install Postgres from https://www.postgresql.org/
- Install a GUI for the database such as PgAdmin4
- In the root, you can find the file Startup.cs. Use your database credentials in the connection string

<b>Note: if you have a database with the old version before the clean install, please use 'dotnet ef database drop' before the next step</b>

- dotnet ef database update

# Run the application
- ASPNETCORE_ENVIRONMENT=development dotnet run
