# GenCare

GenCare is a comprehensive web-based management system designed for healthcare facilities offering gender-specific and sexual health services. It supports a wide range of functionalities, from reproductive health tracking to STI testing and consultation scheduling.

## Development

### Getting started:

#### 1. Set up environment:

Clone this repository, then clone `.env.example` to `.env` and populate with necessary information. The API keys will be added in later, check the group.

#### 2. Install Docker

Go to [Docker Desktop](https://www.docker.com/products/docker-desktop) and install Docker.

After installation completed. Create a personal account and login until you can see the `Containers` page.

#### 3. Development

Open the for the directory by pressing **Ctrl + `** .

For backend:

```
cd backend
```

For frontend:

```
cd frontend
```

Then run:

```
docker-compose -f .\docker-compose.dev.yaml up
```

to start up the development server.

For **backend** the port exposed would be `8080`, means you can access the api webpage on `http://localhost:8080/swagger/index.html`.

For **database** the port exposed would be `5432`, means you can connect to the database using the details in `.env.example` for **development environment** using database viewer tool (Including Microsoft SQL Server Management Tool)

For **frontend** the port exposed would be `3000`, means you can access the webpage on `http://localhost:3000`
