# Development image with SDK for hot reload
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dev

WORKDIR /src

# Copy CSPROJ and restore first for better caching
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/

RUN dotnet restore ./API/API.csproj


# Copy all source files
COPY . .

# Change working directory to where the .csproj file is
WORKDIR /src/API

# Expose port for development
EXPOSE 8080

# Set environment variables for development and hot reload
ENV DOTNET_USE_POLLING_FILE_WATCHER=true \
    ASPNETCORE_ENVIRONMENT=Development \
    ASPNETCORE_URLS=http://+:8080

# Start the app with hot reload
ENTRYPOINT ["dotnet", "watch", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:8080"]