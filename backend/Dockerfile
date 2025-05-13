FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY API/API.csproj ./API/
RUN dotnet restore ./API/API.csproj

COPY . .

WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production

RUN addgroup --gid 1001 appgroup && adduser --uid 1001 --ingroup appgroup --disabled-password gencare

WORKDIR /app

COPY --from=build /app/publish .

USER gencare

EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]
