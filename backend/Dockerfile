# Build stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0-slim AS build
WORKDIR /src
COPY NuGet.Config ./
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
RUN dotnet restore API/API.csproj --packages /src/.nuget/packages --verbosity minimal
COPY . .
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish --packages /src/.nuget/packages

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0-slim AS runtime

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_EnableDiagnostics=0

RUN apt update \
    && apt install -y --no-install-recommends \
       sudo libxkbcommon-x11-0 libc6 libc6-dev libnss3 libatk-bridge2.0-0 \
       libx11-xcb1 libxcb-dri3-0 libdrm-common libgbm1 libasound2 libxrender1 \
       libfontconfig1 libxshmfence1 libgdiplus \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 1001 appgroup && \
    adduser --uid 1001 --ingroup appgroup --disabled-password gencare

WORKDIR /app
COPY --from=build /app/publish .
RUN chown -R gencare:appgroup /app

USER gencare
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]