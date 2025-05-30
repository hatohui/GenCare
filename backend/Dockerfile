# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy NuGet.Config and .sln first
COPY NuGet.Config ./
COPY backend.sln ./

# Copy only .csproj files first for layer caching
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/

# Restore dependencies at the solution level with detailed output
RUN dotnet restore backend.sln --packages /src/.nuget/packages --verbosity detailed

# Copy the rest of the source code, excluding the packages directory if needed
COPY . .

# Set working directory to API before publishing
WORKDIR /src/API

# Publish the app, allowing restore if needed as a fallback
RUN dotnet publish -c Release -o /app/publish --packages /src/.nuget/packages

# Runtime stage e
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_EnableDiagnostics=0

RUN addgroup --gid 1001 appgroup && \
    adduser --uid 1001 --ingroup appgroup --disabled-password gencare

WORKDIR /app
COPY --from=build /app/publish .

USER gencare

EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]