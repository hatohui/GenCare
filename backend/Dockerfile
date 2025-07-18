# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY NuGet.Config ./
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
RUN dotnet restore API/API.csproj --packages /src/.nuget/packages --verbosity detailed
COPY . .
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish --packages /src/.nuget/packages

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_EnableDiagnostics=0

RUN apt-get update && \
    apt-get install -y libgdiplus libc6-dev libx11-dev libxkbcommon-x11-0 && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1001 appgroup && \
    adduser --uid 1001 --ingroup appgroup --disabled-password gencare

WORKDIR /app
COPY --from=build /app/publish .

RUN chown -R gencare:appgroup /app

USER gencare
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]