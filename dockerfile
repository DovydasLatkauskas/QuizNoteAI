FROM ubuntu/dotnet-aspnet:8.0-24.04_stable AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WebApiTemplate.csproj", "./"]
RUN dotnet restore "WebApiTemplate.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "WebApiTemplate.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApiTemplate.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApiTemplate.dll"]
