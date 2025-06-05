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
# Add before ENTRYPOINT
COPY ./https/dev-cert.pfx /https/dev-cert.pfx

# Configure ASP.NET Core to use the certificate
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/dev-cert.pfx \
    ASPNETCORE_Kestrel__Certificates__Default__Password=password123 \
    ASPNETCORE_ENVIRONMENT=Development \
    ASPNETCORE_URLS=https://0.0.0.0:8080;http://0.0.0.0:8081\
    DOTNET_USE_POLLING_FILE_WATCHER=true

EXPOSE 8080 8081

ENTRYPOINT ["dotnet", "watch", "run"]

